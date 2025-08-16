import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/transaction';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      const formattedTransactions: Transaction[] = data.map(item => ({
        id: item.id,
        date: new Date(item.date).toLocaleDateString('en-GB'),
        type: item.type as 'Income' | 'Expense' | 'Transfer',
        account: item.account,
        category: item.category,
        amount: parseFloat(item.amount.toString()),
        currency: item.currency as 'USD' | 'INR' | 'GBP',
        description: item.description
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      // For now, we'll use a dummy user ID since auth isn't implemented yet
      const dummyUserId = '00000000-0000-0000-0000-000000000000';
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          type: transactionData.type,
          account: transactionData.account,
          category: transactionData.category,
          amount: transactionData.amount,
          currency: transactionData.currency,
          description: transactionData.description,
          date: new Date().toISOString().split('T')[0],
          created_by: dummyUserId
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding transaction:', error);
        return { success: false, error };
      }

      // Refresh transactions after adding
      await fetchTransactions();
      return { success: true, data };
    } catch (error) {
      console.error('Error adding transaction:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchTransactions();

    // Set up real-time subscription
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    transactions,
    loading,
    addTransaction,
    refetch: fetchTransactions
  };
};