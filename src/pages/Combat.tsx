import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { getEnemyTemplate } from '../data/enemies';
import { getSkillsForClass, type SkillTemplate } from '../data/skills';
import { Sword, Wind, Flame, ShieldAlert, FlaskConical, Zap, Droplet } from 'lucide-react';

interface CombatLog {
  id: number;
  text: string;
  type: 'player' | 'enemy' | 'system' | 'heal' | 'loot' | 'buff' | 'dot' | 'danger';
}

interface ActiveStatus {
  id: string; // matches skill.id or 'poison'
  name: string;
  type: 'buff' | 'dot';
  duration: number;
  value: number;
}

export default function Combat() {
  const { enemyId } = useParams();
  const navigate = useNavigate();
  const { profile, inventory, takeDamage, healDamage, getAttackDamage, addGold, removeGold, addXp, consumeItem, spendEnergy, changeLocation, addItemToInventory, incrementDailyQuest, incrementCampaignProgress, logAction } = useGame();
  
  const [enemy] = useState(() => enemyId ? getEnemyTemplate(enemyId) : undefined);
  const [enemyHp, setEnemyHp] = useState(enemy ? enemy.max_hp : 0);
  const [logs, setLogs] = useState<CombatLog[]>([]);
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [isFinished, setIsFinished] = useState(false);
  
  const [playerCooldowns, setPlayerCooldowns] = useState<Record<string, number>>({});
  const [playerStatuses, setPlayerStatuses] = useState<ActiveStatus[]>([]);
  const [enemyStatuses, setEnemyStatuses] = useState<ActiveStatus[]>([]);

  const availableSkills = getSkillsForClass(profile?.character_class || '');

  const hasStarted = useRef(false);

  // Kick out if invalid enemy or already dead
  useEffect(() => {
    if (!enemy) {
      navigate('/play/travel');
      return;
    }
    if (profile.hp <= 0 && !isFinished) {
      navigate('/play/profile');
    }
    
    // Initial log only runs once
    if (!hasStarted.current) {
      addLog(`You encountered a ${enemy.name}!`, 'system');
      hasStarted.current = true;
    }
  }, [enemy, navigate, profile.hp, isFinished]);

  const addLog = (text: string, type: CombatLog['type']) => {
    setLogs(prev => [{ id: Date.now() + Math.random(), text, type }, ...prev]);
  };

  const checkCombatEnd = async (currentEnemyHp: number, currentPlayerHp: number) => {
    if (currentPlayerHp <= 0) {
      setIsFinished(true);
      addLog('You have been defeated...', 'danger');
      // Death penalty
      const goldLost = Math.floor(profile.gold * 0.1);
      removeGold(goldLost);
      addLog(`You lost ${goldLost} Gold.`, 'danger');
      // Send them to town
      setTimeout(() => {
        changeLocation('oakhaven');
        navigate('/play/travel');
      }, 3000);
      return true;
    }

    if (currentEnemyHp <= 0) {
      setIsFinished(true);
      addLog(`You defeated the ${enemy!.name}!`, 'system');
      
      // Rewards
      const goldReward = Math.floor(Math.random() * (enemy!.max_gold - enemy!.min_gold + 1)) + enemy!.min_gold;
      addGold(goldReward);
      addXp(enemy!.xp_reward);
      addLog(`Gained ${enemy!.xp_reward} XP and ${goldReward} Gold.`, 'loot');
      logAction(`Defeated ${enemy!.name}. Gained ${enemy!.xp_reward} XP and ${goldReward} Gold.`, 'success');

      // Reward Drops
      for (const drop of enemy!.loot_table) {
        if (Math.random() <= drop.chance) {
          const qty = Math.floor(Math.random() * (drop.max_quantity - drop.min_quantity + 1)) + drop.min_quantity;
          await addItemToInventory(drop.item_id, qty);
          addLog(`Looted ${qty}x ${drop.item_id.replace(/_/g, ' ')}!`, 'loot');
          logAction(`Looted ${qty}x ${drop.item_id.replace(/_/g, ' ')}!`, 'loot');
        }
      }

      if (enemyId === 'bandit_king') {
        incrementDailyQuest();
        addLog(`Daily Bounty Complete!`, 'system');
      }

      // Hacky campaign boss check
      const { CAMPAIGN_DATABASE } = await import('../data/campaign');
      const currentStage = CAMPAIGN_DATABASE.find(c => c.progress_id === profile.campaign_progress);
      if (currentStage && enemyId === currentStage.enemy_id) {
        incrementCampaignProgress();
        addLog(`Campaign Quest Updated!`, 'system');
      }

      setTimeout(() => {
        navigate(-1);
      }, 3000);
      return true;
    }

    return false;
  };

  const processStatuses = async (target: 'player' | 'enemy', currentHp: number) => {
    let hpAfterStatuses = currentHp;
    const statuses = target === 'player' ? playerStatuses : enemyStatuses;
    const newStatuses: ActiveStatus[] = [];

    for (const status of statuses) {
      if (status.type === 'dot') {
        hpAfterStatuses -= status.value;
        if (target === 'player') {
          takeDamage(status.value);
          addLog(`You took ${status.value} damage from ${status.name}!`, 'danger');
        } else {
          setEnemyHp(hpAfterStatuses);
          addLog(`${enemy!.name} took ${status.value} damage from ${status.name}!`, 'player');
        }
      }

      if (status.duration > 1) {
        newStatuses.push({ ...status, duration: status.duration - 1 });
      } else if (status.type === 'buff') {
        addLog(`${status.name} has worn off.`, 'system');
      }
    }

    if (target === 'player') setPlayerStatuses(newStatuses);
    else setEnemyStatuses(newStatuses);

    return hpAfterStatuses;
  };

  const decrementCooldowns = () => {
    setPlayerCooldowns(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        if (next[key] > 0) next[key] -= 1;
      });
      return next;
    });
  };

  const handleEnemyTurn = async (currentEnemyHp: number) => {
    if (isFinished || !enemy) return;
    
    // Process Enemy Statuses (e.g. Poison taking effect before they hit)
    const hpAfterStatuses = await processStatuses('enemy', currentEnemyHp);
    let isEnded = await checkCombatEnd(hpAfterStatuses, profile.hp);
    if (isEnded) return;

    setTimeout(async () => {
      // Check Player Evade
      const evadeStatus = playerStatuses.find(s => s.id === 'skill_evade');
      if (evadeStatus) {
        addLog(`The ${enemy.name} attacked, but you dodged into the shadows!`, 'buff');
      } else {
        // Calculate raw damage
        const rawDamage = enemy.base_damage + Math.floor(Math.random() * 4) - 2;
        let actualDamage = Math.max(1, rawDamage);
        
        // Check Player Defensive Buffs
        const ironSkin = playerStatuses.find(s => s.id === 'skill_iron_skin');
        if (ironSkin) {
          actualDamage = Math.floor(actualDamage * (1 - ironSkin.value));
          addLog(`Your Iron Skin absorbed some of the blow!`, 'buff');
        }

        addLog(`The ${enemy.name} attacks for ${actualDamage} damage!`, 'enemy');
        takeDamage(actualDamage);
        
        isEnded = await checkCombatEnd(hpAfterStatuses, profile.hp - actualDamage);
      }

      if (!isEnded) {
        // Actually, let's just decrement cooldowns and switch turn.
        decrementCooldowns();
        setTurn('player');
      }
    }, 1000);
  };

  const handlePlayerAttack = async () => {
    if (turn !== 'player' || isFinished || !enemy) return;
    setTurn('enemy');
    
    // Process Player Statuses
    const playerHpAfter = await processStatuses('player', profile.hp);
    let isEnded = await checkCombatEnd(enemyHp, playerHpAfter);
    if (isEnded) return;

    // Calculate player damage
    const damage = getAttackDamage();
    const actualDamage = Math.max(1, damage - enemy.defense);
    
    const newEnemyHp = Math.max(0, enemyHp - actualDamage);
    setEnemyHp(newEnemyHp);
    addLog(`You attacked for ${actualDamage} damage!`, 'player');

    isEnded = await checkCombatEnd(newEnemyHp, playerHpAfter);
    if (!isEnded) {
      handleEnemyTurn(newEnemyHp);
    }
  };

  const handleUseSkill = async (skill: SkillTemplate) => {
    if (turn !== 'player' || isFinished || !enemy || (playerCooldowns[skill.id] || 0) > 0) return;
    
    if (!spendEnergy(skill.energy_cost)) {
      addLog(`Not enough energy to use ${skill.name}.`, 'system');
      return;
    }

    setTurn('enemy');
    setPlayerCooldowns(prev => ({ ...prev, [skill.id]: skill.cooldown_turns }));

    const playerHpAfter = await processStatuses('player', profile.hp);
    let isEnded = await checkCombatEnd(enemyHp, playerHpAfter);
    if (isEnded) return;

    let newEnemyHp = enemyHp;

    if (skill.effect_type === 'damage') {
      let damage = getAttackDamage();
      if (skill.class_req === 'mage') {
        damage = profile.intelligence * 2; // Mage spells scale mostly off Int
      }
      const actualDamage = Math.floor(Math.max(1, (damage * skill.base_value) - enemy.defense));
      newEnemyHp = Math.max(0, enemyHp - actualDamage);
      setEnemyHp(newEnemyHp);
      addLog(`You used ${skill.name} for ${actualDamage} damage!`, 'player');

    } else if (skill.effect_type === 'heal') {
      const healAmount = Math.floor(skill.base_value + (profile.intelligence * 1.5));
      healDamage(healAmount);
      addLog(`You used ${skill.name} and healed for ${healAmount} HP!`, 'heal');

    } else if (skill.effect_type === 'buff') {
      addLog(`You cast ${skill.name}!`, 'buff');
      setPlayerStatuses(prev => {
        const existing = prev.findIndex(s => s.id === skill.id);
        if (existing > -1) {
          const next = [...prev];
          next[existing].duration = skill.duration!;
          return next;
        }
        return [...prev, { id: skill.id, name: skill.name, type: 'buff', duration: skill.duration!, value: skill.base_value }];
      });

    } else if (skill.effect_type === 'dot') {
      const initialDamage = Math.floor(getAttackDamage() * 0.5);
      newEnemyHp = Math.max(0, enemyHp - initialDamage);
      setEnemyHp(newEnemyHp);
      addLog(`You struck with ${skill.name} for ${initialDamage} damage and poisoned the enemy!`, 'player');
      
      setEnemyStatuses(prev => {
        const existing = prev.findIndex(s => s.id === skill.id);
        if (existing > -1) {
          const next = [...prev];
          next[existing].duration = skill.duration!;
          return next;
        }
        return [...prev, { id: skill.id, name: skill.name, type: 'dot', duration: skill.duration!, value: skill.base_value }];
      });
    }

    isEnded = await checkCombatEnd(newEnemyHp, profile.hp); // profile.hp is a little stale if we just healed, but checkCombatEnd only checks <= 0
    if (!isEnded) {
      handleEnemyTurn(newEnemyHp);
    }
  };

  const handleUsePotion = () => {
    if (turn !== 'player' || isFinished) return;
    
    const potion = inventory.find(i => i.item_id === 'minor_health_potion');
    if (!potion || potion.quantity <= 0) {
      addLog('You have no Health Potions!', 'system');
      return;
    }

    const result = consumeItem(potion.id);
    if (result.success) {
      addLog(`You drank a Health Potion. +25 HP`, 'heal');
      // Free action!
    } else {
      addLog(result.message, 'system');
    }
  };

  const handleFlee = () => {
    if (turn !== 'player' || isFinished || !enemy) return;
    
    if (!spendEnergy(10)) {
      addLog('Not enough energy to flee (requires 10).', 'system');
      return;
    }

    if (Math.random() > 0.5) {
      addLog('You successfully fled the battle!', 'system');
      setIsFinished(true);
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } else {
      addLog('You failed to flee!', 'danger');
      setTurn('enemy');
      handleEnemyTurn(enemyHp);
    }
  };

  if (!enemy) return null;

  return (
    <div className="flex flex-col h-[85vh] animate-fade-in text-stone-300 relative z-10 p-2 sm:p-4 md:p-8">
      
      <div className="flex justify-between items-center border-b-2 border-stone-800 pb-2 mb-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-cinzel text-red-700 drop-shadow-sm flex items-center gap-2">
            <Sword size={24} className="text-red-900" /> Combat Encounter
          </h1>
          <p className="text-sm font-sans text-stone-500 italic">Fight for your life.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* Arena View */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden relative">
          
          <div className="flex-1 bg-stone-900/50 border border-stone-800 rounded relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 to-transparent pointer-events-none" />
            
            {/* Status Headers */}
            <div className="flex justify-between p-4 bg-stone-950/80 border-b border-stone-800 z-10 shrink-0">
              {/* Player HP */}
              <div className="flex flex-col gap-1 w-1/3">
                <span className="font-cinzel text-stone-300 font-bold">{profile.username}</span>
                <div className="w-full bg-stone-800 h-3 rounded overflow-hidden border border-stone-700">
                  <div className="bg-green-600 h-full transition-all duration-300" style={{ width: `${Math.max(0, (profile.hp / profile.max_hp) * 100)}%` }} />
                </div>
                <div className="flex justify-between text-xs text-stone-400">
                  <span>HP: {profile.hp}/{profile.max_hp}</span>
                  <span className="flex items-center gap-1 text-blue-400"><Zap size={10} /> {profile.energy}</span>
                </div>
                {/* Active Player Statuses */}
                <div className="flex gap-1 mt-1 flex-wrap">
                  {playerStatuses.map(s => (
                    <span key={s.id} className={`text-[10px] px-1 rounded border ${s.type === 'buff' ? 'border-blue-700 bg-blue-900/50 text-blue-300' : 'border-green-700 bg-green-900/50 text-green-300'}`}>
                      {s.name} ({s.duration})
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center font-cinzel text-stone-500 text-xl font-bold px-4">
                VS
              </div>

              {/* Enemy HP */}
              <div className="flex flex-col gap-1 w-1/3 items-end">
                <span className="font-cinzel text-red-500 font-bold text-right">{enemy.name}</span>
                <div className="w-full bg-stone-800 h-3 rounded overflow-hidden border border-stone-700">
                  <div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${Math.max(0, (enemyHp / enemy.max_hp) * 100)}%` }} />
                </div>
                <span className="text-xs text-stone-400">HP: {enemyHp}/{enemy.max_hp}</span>
                {/* Active Enemy Statuses */}
                <div className="flex gap-1 mt-1 flex-wrap justify-end">
                  {enemyStatuses.map(s => (
                    <span key={s.id} className={`text-[10px] px-1 rounded border ${s.type === 'dot' ? 'border-green-700 bg-green-900/50 text-green-300' : 'border-stone-700 bg-stone-900/50 text-stone-300'}`}>
                      {s.name} ({s.duration})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Combat Logs */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-2 custom-scrollbar">
              {logs.map(log => (
                <div key={log.id} className={`p-2 rounded text-sm animate-fade-in border-l-2
                  ${log.type === 'system' ? 'bg-stone-950 border-stone-600 text-stone-400' : ''}
                  ${log.type === 'player' ? 'bg-stone-900 border-green-600 text-stone-200' : ''}
                  ${log.type === 'enemy' ? 'bg-red-950/30 border-red-800 text-red-300' : ''}
                  ${log.type === 'heal' ? 'bg-green-950/30 border-green-500 text-green-400 font-bold' : ''}
                  ${log.type === 'buff' ? 'bg-blue-950/30 border-blue-500 text-blue-400' : ''}
                  ${log.type === 'danger' ? 'bg-red-950 border-red-600 text-red-400 font-bold' : ''}
                  ${log.type === 'loot' ? 'bg-amber-950/30 border-amber-500 text-amber-500 font-bold' : ''}
                `}>
                  {log.text}
                </div>
              ))}
            </div>
            
            {/* Action Bar */}
            <div className="bg-stone-950 border-t border-stone-800 p-4 shrink-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-cinzel text-amber-500 font-bold">Actions</span>
                <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${turn === 'player' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
                  {turn === 'player' ? 'Your Turn' : 'Enemy Turn...'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button 
                  onClick={handlePlayerAttack}
                  disabled={turn !== 'player' || isFinished}
                  className="bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-red-800 text-stone-300 p-3 rounded flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Sword size={20} className="text-stone-500 group-hover:text-red-500 transition-colors" />
                  <span className="text-xs font-bold uppercase tracking-wider">Attack</span>
                </button>
                
                {availableSkills.map(skill => {
                  const cooldown = playerCooldowns[skill.id] || 0;
                  const isAvailable = cooldown === 0 && profile.energy >= skill.energy_cost;
                  
                  return (
                    <button 
                      key={skill.id}
                      onClick={() => handleUseSkill(skill)}
                      disabled={turn !== 'player' || isFinished || !isAvailable}
                      className="bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-blue-800 text-stone-300 p-2 rounded flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative"
                      title={skill.description}
                    >
                      {skill.effect_type === 'damage' ? <Flame size={16} className="text-orange-500" /> :
                       skill.effect_type === 'heal' ? <Droplet size={16} className="text-green-500" /> :
                       skill.effect_type === 'buff' ? <ShieldAlert size={16} className="text-blue-500" /> :
                       <Wind size={16} className="text-purple-500" />}
                      <span className="text-[10px] font-bold uppercase tracking-wider leading-tight text-center">{skill.name}</span>
                      <span className="text-[9px] text-blue-400 flex items-center gap-0.5"><Zap size={8}/>{skill.energy_cost}</span>
                      
                      {cooldown > 0 && (
                        <div className="absolute inset-0 bg-stone-950/80 flex items-center justify-center rounded border border-stone-800">
                          <span className="text-xl font-bold text-red-500 drop-shadow">{cooldown}</span>
                        </div>
                      )}
                    </button>
                  );
                })}

                <button 
                  onClick={handleUsePotion}
                  disabled={turn !== 'player' || isFinished}
                  className="bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-green-800 text-stone-300 p-2 rounded flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative"
                >
                  <FlaskConical size={16} className="text-stone-500 group-hover:text-green-500 transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Potion</span>
                  <span className="text-[9px] text-stone-500">Free Action</span>
                  
                  {/* Potion Badge */}
                  <div className="absolute -top-1 -right-1 bg-green-900 text-green-100 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-green-700">
                    {inventory.find(i => i.item_id === 'minor_health_potion')?.quantity || 0}
                  </div>
                </button>

                <button 
                  onClick={handleFlee}
                  disabled={turn !== 'player' || isFinished}
                  className="bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-stone-500 text-stone-300 p-2 rounded flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group col-span-2 sm:col-span-1"
                >
                  <Wind size={16} className="text-stone-500 group-hover:text-stone-300 transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Flee</span>
                  <span className="text-[9px] text-blue-400 flex items-center gap-0.5"><Zap size={8}/> 10</span>
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
