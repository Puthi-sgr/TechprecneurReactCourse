import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, AppState, FlatList, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native'
import { normalizeHabitInput, getLocalDateString } from '../shared/habitLogic'
import type { HabitRecord } from '../shared/habitLogic'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import { ShareButton } from './components/ShareButton'
import './global.css'

type ScreenName = 'list' | 'add'

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('list')
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [habits, setHabits] = useState<HabitRecord[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const today = useMemo(() => getLocalDateString(), [])

  const loadHabits = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error: queryError } = await supabase.from('habits')
      .select('id,user_id,name,description,created_at,daily_logs(id,log_date,completed)')
      .eq('user_id', userId).order('created_at', { ascending: true })
    if (queryError) setError(queryError.message)
    else setHabits((data ?? []) as HabitRecord[])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null)
    })
    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') supabase.auth.startAutoRefresh()
      else supabase.auth.stopAutoRefresh()
    })
    return () => { subscription.unsubscribe(); appStateSubscription.remove() }
  }, [])

  useEffect(() => { void loadHabits() }, [loadHabits])

  const signIn = async () => {
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (signInError) setError(signInError.message)
  }

  const addHabit = async () => {
    if (!userId) return
    setError(null)
    let values
    try { values = normalizeHabitInput(name, description) }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Check the habit name.'); return }
    setSaving(true)
    const { error: insertError } = await supabase.from('habits').insert({
      user_id: userId, name: values.name, description: values.description || null,
    })
    setSaving(false)
    if (insertError) { setError(insertError.message); return }
    setName('')
    setDescription('')
    setScreen('list')
    await loadHabits()
  }

  const toggleHabit = async (habit: HabitRecord) => {
    if (!userId) return
    const todayLog = habit.daily_logs?.find((log) => log.log_date === today)
    const { error: toggleError } = await supabase.from('daily_logs').upsert({
      habit_id: habit.id, user_id: userId, log_date: today, completed: !(todayLog?.completed ?? false),
    }, { onConflict: 'habit_id,log_date' })
    if (toggleError) setError(toggleError.message)
    else await loadHabits()
  }

  if (!isSupabaseConfigured) return <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-6"><Text className="text-center text-base text-slate-700">Add the Supabase values to expo-app/.env, then restart Expo.</Text></SafeAreaView>

  if (!userId) return (
    <SafeAreaView className="flex-1 justify-center bg-slate-50 px-6">
      <Text className="text-3xl font-bold text-slate-900">Habit tracker</Text>
      <Text className="mb-6 mt-2 text-slate-600">Sign in to load your habits.</Text>
      <TextInput className="mb-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base" autoCapitalize="none" keyboardType="email-address" placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput className="mb-4 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base" placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      {error && <Text className="mb-3 text-red-700">{error}</Text>}
      <Pressable className="rounded-xl bg-blue-600 p-4" onPress={() => void signIn()}><Text className="text-center font-semibold text-white">Sign in</Text></Pressable>
    </SafeAreaView>
  )

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
        <View><Text className="text-xs font-semibold uppercase tracking-widest text-blue-600">Learning log</Text><Text className="text-2xl font-bold text-slate-900">{screen === 'list' ? 'Your habits' : 'Add a habit'}</Text></View>
        <ShareButton />
      </View>
      <View className="flex-1 px-5 pt-5">
        {error && <Text className="mb-3 rounded-xl bg-red-50 p-3 text-red-800">{error}</Text>}
        {screen === 'add' ? (
          <View className="gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <View><Text className="mb-1 font-medium text-slate-700">Name</Text><TextInput className="rounded-xl border border-slate-300 px-3 py-3 text-base" maxLength={80} placeholder="Read 20 minutes" value={name} onChangeText={setName} /></View>
            <View><Text className="mb-1 font-medium text-slate-700">Description</Text><TextInput className="rounded-xl border border-slate-300 px-3 py-3 text-base" maxLength={200} placeholder="Any book counts" value={description} onChangeText={setDescription} /></View>
            <Pressable disabled={saving} className="rounded-xl bg-blue-600 p-4" onPress={() => void addHabit()}><Text className="text-center font-semibold text-white">{saving ? 'Saving…' : 'Save habit'}</Text></Pressable>
            <Pressable className="p-2" onPress={() => setScreen('list')}><Text className="text-center font-medium text-slate-600">Cancel</Text></Pressable>
          </View>
        ) : loading ? <ActivityIndicator className="mt-10" size="large" color="#2563eb" /> : (
          <FlatList
            data={habits}
            keyExtractor={(habit) => habit.id}
            contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
            ListEmptyComponent={<View className="rounded-2xl border border-dashed border-slate-300 bg-white p-7"><Text className="text-center text-slate-600">No habits yet. Add your first one.</Text></View>}
            renderItem={({ item }) => {
              const done = item.daily_logs?.some((log) => log.log_date === today && log.completed) ?? false
              return <View className="rounded-2xl border border-slate-200 bg-white p-5"><View className="flex-row items-start justify-between gap-3"><Text className="flex-1 text-lg font-semibold text-slate-900">{item.name}</Text><Text className={done ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800' : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600'}>{done ? 'Done today' : 'Not done'}</Text></View><Text className="mt-2 text-slate-600">{item.description || 'No description'}</Text><Pressable className="mt-4 self-start rounded-lg bg-blue-600 px-4 py-2" onPress={() => void toggleHabit(item)}><Text className="font-semibold text-white">{done ? 'Undo today' : 'Mark done'}</Text></Pressable></View>
            }}
          />
        )}
      </View>
      <View className="flex-row gap-3 border-t border-slate-200 bg-white px-5 py-4">
        <Pressable className={screen === 'list' ? 'flex-1 rounded-xl bg-blue-600 p-3' : 'flex-1 rounded-xl bg-slate-100 p-3'} onPress={() => setScreen('list')}><Text className={screen === 'list' ? 'text-center font-semibold text-white' : 'text-center font-semibold text-slate-700'}>Habit list</Text></Pressable>
        <Pressable className={screen === 'add' ? 'flex-1 rounded-xl bg-blue-600 p-3' : 'flex-1 rounded-xl bg-slate-100 p-3'} onPress={() => setScreen('add')}><Text className={screen === 'add' ? 'text-center font-semibold text-white' : 'text-center font-semibold text-slate-700'}>Add habit</Text></Pressable>
        <Pressable className="rounded-xl bg-slate-100 p-3" onPress={() => void supabase.auth.signOut()}><Text className="font-semibold text-slate-700">Sign out</Text></Pressable>
      </View>
    </SafeAreaView>
  )
}
