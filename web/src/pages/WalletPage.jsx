import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/shared/Toast';
import { cn, displayName } from '@/lib/utils';
import { Wallet, Gift, History, ShoppingBag, Coins, TrendingUp, TrendingDown } from 'lucide-react';

export default function WalletPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [tab, setTab] = useState('shop'); // shop | history

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [bal, txn, rwd] = await Promise.all([
        api('/api/wallet/balance'),
        api('/api/wallet/transactions'),
        api('/api/rewards'),
      ]);
      setBalance(bal.data?.balance || 0);
      setTransactions(txn.data || []);
      setRewards(rwd.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function redeem(reward) {
    if (balance < reward.cost) { toast('แต้มไม่พอ!', 'error'); return; }
    if (!confirm(`แลก "${reward.name}" ใช้ ${reward.cost} แต้ม?`)) return;
    setRedeeming(reward.id);
    try {
      await api('/api/rewards/redeem', 'POST', { reward_id: reward.id });
      toast(`🎁 แลก ${reward.name} สำเร็จ!`);
      loadData();
    } catch (e) { toast(e.message, 'error'); }
    finally { setRedeeming(null); }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <div className="animate-spin w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full mb-3" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Balance Card */}
      <div className="card bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 mb-6">
        <div className="flex items-center gap-4">
          {user?.profile_image ? (
            <img src={user.profile_image} className="w-14 h-14 rounded-full ring-3 ring-white/30 object-cover" alt="" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              {user?.avatar || '👤'}
            </div>
          )}
          <div>
            <div className="text-sm opacity-80">💰 กระเป๋าของ {displayName(user)}</div>
            <div className="text-4xl font-bold mt-1">{balance.toLocaleString()}</div>
            <div className="text-xs opacity-70 mt-0.5">💎 แต้มคงเหลือ = {balance} บาท</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1 mb-6">
        <button onClick={() => setTab('shop')} className={cn('flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2',
          tab === 'shop' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500')}>
          <Gift className="w-4 h-4" /> แลกรางวัล
        </button>
        <button onClick={() => setTab('history')} className={cn('flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2',
          tab === 'history' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500')}>
          <History className="w-4 h-4" /> ประวัติแต้ม
        </button>
      </div>

      {tab === 'shop' ? (
        /* Rewards Shop */
        <div>
          {rewards.length === 0 ? (
            <div className="card p-12 text-center text-slate-400">
              <div className="text-5xl mb-4">🎁</div>
              <p className="font-semibold">ยังไม่มีรางวัล</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {rewards.map(r => {
                const canAfford = balance >= r.cost;
                return (
                  <div key={r.id} className="card p-4 text-center hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-2">{r.icon || '🎁'}</div>
                    <div className="text-sm font-bold mb-1">{r.name}</div>
                    <div className={cn('text-lg font-bold mb-3', canAfford ? 'text-emerald-600' : 'text-red-500')}>
                      {r.cost} แต้ม
                    </div>
                    <div className="text-[10px] text-slate-400 mb-2">= {r.cost} บาท</div>
                    <button
                      onClick={() => redeem(r)}
                      disabled={!canAfford || redeeming === r.id}
                      className={cn(
                        'w-full py-2 rounded-xl text-xs font-bold transition-all',
                        canAfford
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      )}
                    >
                      {redeeming === r.id ? '...' : canAfford ? '🎁 แลกเลย' : '🔒 แต้มไม่พอ'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Transaction History */
        <div>
          {transactions.length === 0 ? (
            <div className="card p-12 text-center text-slate-400">
              <div className="text-5xl mb-4">📭</div>
              <p className="font-semibold">ยังไม่มีรายการ</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map(tx => {
                const isEarn = tx.type === 'earn';
                return (
                  <div key={tx.id} className="card px-4 py-3 flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                      isEarn ? 'bg-emerald-100' : 'bg-red-100')}>
                      {isEarn ? <TrendingUp className="w-4 h-4 text-emerald-600" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{tx.description || (isEarn ? 'ได้รับแต้ม' : 'ใช้แต้ม')}</div>
                      <div className="text-[11px] text-slate-400">{tx.created_at?.replace('T', ' ').slice(0, 16)}</div>
                    </div>
                    <div className={cn('text-sm font-bold', isEarn ? 'text-emerald-600' : 'text-red-500')}>
                      {isEarn ? '+' : ''}{tx.amount}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
