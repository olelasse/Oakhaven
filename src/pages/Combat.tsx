import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { getEnemyTemplate } from '../data/enemies';
import { Sword, Wind, Flame, ShieldAlert, FlaskConical, ArrowLeft } from 'lucide-react';

interface CombatLog {
  id: number;
  text: string;
  type: 'player' | 'enemy' | 'system' | 'heal' | 'loot';
}

export default function Combat() {
  const { enemyId } = useParams();
  const navigate = useNavigate();
  const { profile, inventory, takeDamage, getAttackDamage, addGold, removeGold, addXp, consumeItem, spendEnergy, changeLocation, addItemToInventory, incrementDailyQuest } = useGame();
  
  const [enemy] = useState(() => enemyId ? getEnemyTemplate(enemyId) : undefined);
  const [enemyHp, setEnemyHp] = useState(enemy ? enemy.max_hp : 0);
  const [logs, setLogs] = useState<CombatLog[]>([]);
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [isFinished, setIsFinished] = useState(false);
  const [skillCooldown, setSkillCooldown] = useState(0);

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
      addLog('You have been defeated...', 'danger' as any);
      // Death penalty
      const goldLost = Math.floor(profile.gold * 0.1);
      removeGold(goldLost);
      addLog(`You lost ${goldLost} Gold.`, 'danger' as any);
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

      // Reward Drops
      for (const drop of enemy!.loot_table) {
        if (Math.random() <= drop.chance) {
          const qty = Math.floor(Math.random() * (drop.max_quantity - drop.min_quantity + 1)) + drop.min_quantity;
          await addItemToInventory(drop.item_id, qty);
          addLog(`Looted ${qty}x ${drop.item_id.replace(/_/g, ' ')}!`, 'loot');
        }
      }

      // Hacky boss check for Daily Quests
      if (enemyId === 'bandit_king') {
        incrementDailyQuest();
        addLog(`Daily Bounty Complete!`, 'system');
      }

      setTimeout(() => {
        navigate(-1); // go back to wherever they came from
      }, 3000);
      return true;
    }

    return false;
  };

  const handleEnemyTurn = (currentEnemyHp: number) => {
    if (isFinished || !enemy) return;
    
    setTimeout(async () => {
      // Calculate damage
      const rawDamage = enemy.base_damage + Math.floor(Math.random() * 4) - 2;
      const actualDamage = Math.max(1, rawDamage); // eventually subtract player defense
      
      addLog(`The ${enemy.name} attacks for ${actualDamage} damage!`, 'enemy');
      takeDamage(actualDamage);
      
      const isEnded = await checkCombatEnd(currentEnemyHp, profile.hp - actualDamage);
      if (!isEnded) {
        setTurn('player');
        if (skillCooldown > 0) setSkillCooldown(c => c - 1);
      }
    }, 1000);
  };

  const handlePlayerAttack = async () => {
    if (turn !== 'player' || isFinished || !enemy) return;
    
    setTurn('enemy');
    
    // Calculate player damage
    const damage = getAttackDamage();
    const actualDamage = Math.max(1, damage - enemy.defense);
    
    const newEnemyHp = Math.max(0, enemyHp - actualDamage);
    setEnemyHp(newEnemyHp);
    addLog(`You attacked for ${actualDamage} damage!`, 'player');

    const isEnded = await checkCombatEnd(newEnemyHp, profile.hp);
    if (!isEnded) {
      handleEnemyTurn(newEnemyHp);
    }
  };

  const handlePlayerSkill = async () => {
    if (turn !== 'player' || isFinished || !enemy || skillCooldown > 0) return;
    setTurn('enemy');
    setSkillCooldown(3);

    let damage = getAttackDamage();
    let skillName = '';
    
    if (profile.character_class === 'warrior') {
      skillName = 'Cleave';
      damage = Math.floor(damage * 1.5);
    } else if (profile.character_class === 'rogue') {
      skillName = 'Backstab';
      const hits = Math.random() > 0.2; // 80% chance
      if (!hits) {
        addLog(`You attempted to Backstab but missed!`, 'player');
        handleEnemyTurn(enemyHp);
        return;
      }
      damage = Math.floor(damage * 2.0);
    } else if (profile.character_class === 'mage') {
      skillName = 'Fireball';
      damage = Math.floor(damage * 1.0 + profile.intelligence * 1.5); // ignores defense basically
    }

    const actualDamage = Math.max(1, damage - (profile.character_class === 'mage' ? 0 : enemy.defense));
    const newEnemyHp = Math.max(0, enemyHp - actualDamage);
    setEnemyHp(newEnemyHp);
    addLog(`You used ${skillName} for ${actualDamage} damage!`, 'player');

    const isEnded = await checkCombatEnd(newEnemyHp, profile.hp);
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
      // Using potion DOES NOT take a turn, but we could make it take a turn. Let's be nice and not consume the turn.
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
      addLog('You failed to flee!', 'system');
      setTurn('enemy');
      handleEnemyTurn(enemyHp);
    }
  };

  if (!enemy) return null;

  const potionCount = inventory.find(i => i.item_id === 'minor_health_potion')?.quantity || 0;

  return (
    <div className="animate-fade-in flex flex-col h-[80vh] text-stone-300">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-stone-800 pb-2 mb-4 shrink-0">
        <div>
          <h1 className="text-3xl font-cinzel text-red-700 drop-shadow-sm flex items-center gap-2">
            <ShieldAlert /> Combat
          </h1>
        </div>
        <button onClick={() => navigate(-1)} disabled={!isFinished} className="flex items-center gap-2 px-4 py-2 bg-stone-900 border border-stone-700 text-stone-500 rounded text-sm disabled:opacity-50">
          <ArrowLeft size={16} /> Run Away
        </button>
      </div>

      {/* Battle Arena */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Stage */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          <div className="flex-1 bg-stone-950 rounded-lg border border-stone-800 p-6 flex items-center justify-between relative shadow-[inset_0_0_50px_rgba(0,0,0,1)] bg-cover bg-center"
               style={{ backgroundImage: `linear-gradient(rgba(12, 10, 9, 0.8), rgba(12, 10, 9, 0.8)), url('${enemy.image_url}')` }}
          >
            {/* Player Sprite */}
            <div className="flex flex-col items-center gap-2 z-10 w-32">
              <div className={`w-24 h-24 rounded-full border-4 ${turn === 'player' ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'border-stone-700'} overflow-hidden transition-all duration-300`}>
                <img src={`/images/avatars/${profile.character_class}_${profile.gender}.png`} alt="Player" className="w-full h-full object-cover" />
              </div>
              <div className="w-full bg-stone-900 h-3 rounded-full border border-stone-700 overflow-hidden relative">
                <div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${(profile.hp / profile.max_hp) * 100}%` }}></div>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow">{profile.hp}/{profile.max_hp}</span>
              </div>
            </div>

            <div className="text-stone-500 font-cinzel text-xl font-bold italic absolute left-1/2 -translate-x-1/2">VS</div>

            {/* Enemy Sprite */}
            <div className="flex flex-col items-center gap-2 z-10 w-32">
              <div className={`w-24 h-24 rounded-full border-4 ${turn === 'enemy' ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'border-stone-700'} overflow-hidden transition-all duration-300`}>
                <img src={enemy.image_url} alt="Enemy" className="w-full h-full object-cover" />
              </div>
              <div className="text-center w-full">
                <p className="text-xs font-bold text-red-400 mb-1">{enemy.name}</p>
                <div className="w-full bg-stone-900 h-3 rounded-full border border-stone-700 overflow-hidden relative">
                  <div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${(enemyHp / enemy.max_hp) * 100}%` }}></div>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow">{enemyHp}/{enemy.max_hp}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-stone-900 p-4 border border-stone-800 rounded grid grid-cols-2 sm:grid-cols-4 gap-4 shrink-0">
            <button 
              onClick={handlePlayerAttack} disabled={turn !== 'player' || isFinished}
              className="flex flex-col items-center gap-2 p-3 bg-stone-950 border border-stone-700 rounded hover:border-amber-500 hover:text-amber-500 disabled:opacity-50 disabled:hover:border-stone-700 disabled:hover:text-stone-300 transition-colors"
            >
              <Sword size={20} /> <span className="text-sm font-bold">Attack</span>
            </button>

            <button 
              onClick={handlePlayerSkill} disabled={turn !== 'player' || isFinished || skillCooldown > 0}
              className="flex flex-col items-center gap-2 p-3 bg-stone-950 border border-stone-700 rounded hover:border-blue-500 hover:text-blue-500 disabled:opacity-50 disabled:hover:border-stone-700 disabled:hover:text-stone-300 transition-colors relative"
            >
              {profile.character_class === 'warrior' && <Sword size={20} />}
              {profile.character_class === 'rogue' && <Wind size={20} />}
              {profile.character_class === 'mage' && <Flame size={20} />}
              <span className="text-sm font-bold">
                {profile.character_class === 'warrior' ? 'Cleave' : profile.character_class === 'rogue' ? 'Backstab' : 'Fireball'}
              </span>
              {skillCooldown > 0 && <span className="absolute top-1 right-2 text-xs text-blue-400 font-bold">{skillCooldown}</span>}
            </button>

            <button 
              onClick={handleUsePotion} disabled={turn !== 'player' || isFinished || potionCount <= 0}
              className="flex flex-col items-center gap-2 p-3 bg-stone-950 border border-stone-700 rounded hover:border-green-500 hover:text-green-500 disabled:opacity-50 disabled:hover:border-stone-700 disabled:hover:text-stone-300 transition-colors relative"
            >
              <FlaskConical size={20} /> <span className="text-sm font-bold">Potion</span>
              <span className="absolute top-1 right-2 text-xs font-bold bg-stone-800 px-1 rounded border border-stone-700 text-stone-400">{potionCount}</span>
            </button>

            <button 
              onClick={handleFlee} disabled={turn !== 'player' || isFinished || profile.energy < 10}
              className="flex flex-col items-center gap-2 p-3 bg-stone-950 border border-stone-700 rounded hover:border-stone-500 hover:text-stone-400 disabled:opacity-50 disabled:hover:border-stone-700 disabled:hover:text-stone-300 transition-colors"
            >
              <ArrowLeft size={20} /> <span className="text-sm font-bold">Flee (-10E)</span>
            </button>
          </div>
        </div>

        {/* Combat Log */}
        <div className="w-full lg:w-1/3 bg-stone-950/90 rounded border border-stone-800 p-4 shadow-inner flex flex-col min-h-[250px]">
          <h2 className="font-cinzel text-stone-400 border-b border-stone-800 pb-2 mb-2 shrink-0">Battle Log</h2>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className={`text-sm p-2 rounded bg-stone-900/50 border-l-2 animate-fade-in
                  ${log.type === 'system' ? 'border-stone-600 text-stone-400' : ''}
                  ${log.type === 'player' ? 'border-amber-500 text-amber-400' : ''}
                  ${log.type === 'enemy' ? 'border-red-600 text-red-400' : ''}
                  ${log.type === 'heal' ? 'border-green-500 text-green-400' : ''}
                  ${log.type === 'loot' ? 'border-blue-500 text-blue-400 font-bold' : ''}
                `}
              >
                {log.text}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
