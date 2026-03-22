import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Text, View, TouchableOpacity,
  FlatList, SafeAreaView, ActivityIndicator, TextInput, Platform,
} from 'react-native';
import * as Device from 'expo-device';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const SUPABASE_URL = 'https://uoetcnbpvgovjqnvpvtz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZXRjbmJwdmdvdmpxbnZwdnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjk1MDAsImV4cCI6MjA4OTcwNTUwMH0.064TFKLxXCCRZPmJEK47O_QiRcxllJA2Bjx6TxdSNsY';

const ExpoSecureStoreAdapter = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

let Notifications = null;
try {
  Notifications = require('expo-notifications');
  if (Notifications?.setNotificationHandler) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
} catch (e) {}

async function registerForPushNotifications() {
  if (!Notifications?.requestPermissionsAsync) return;
  if (!Device.isDevice) return;
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') await Notifications.requestPermissionsAsync();
}

async function scheduleTaskReminders(tasks) {
  if (!Notifications?.scheduleNotificationAsync) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  const now = new Date();
  for (const task of tasks) {
    if (task.completed || !task.start_time || !task.date) continue;
    const [h, m] = task.start_time.split(':').map(Number);
    const taskDate = new Date(`${task.date}T00:00:00`);
    taskDate.setHours(h, m, 0, 0);
    const remindAt = new Date(taskDate.getTime() - 15 * 60 * 1000);
    if (remindAt <= now) continue;
    await Notifications.scheduleNotificationAsync({
      content: { title: '⏰ Starting soon', body: task.title, sound: true },
      trigger: { date: remindAt },
    });
  }
}

function localDateStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}

const colors = {
  bg:      '#0f1621',
  surface: '#161e2e',
  surface2:'#1c2540',
  border:  '#232d44',
  text:    '#e8edf5',
  text2:   '#7a8aaa',
  text3:   '#3d4d6a',
  accent:  '#2d8ff5',
  warn:    '#f5823d',
  green:   '#22d3a0',
};

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    registerForPushNotifications();
    loadData();
  }, [session]);

  async function loadData() {
    const todayStr = localDateStr();
    const { data: taskData } = await supabase.from('tasks').select('*').eq('user_id', session.user.id).gte('date', todayStr).order('start_time');
    const { data: assignmentData } = await supabase.from('assignments').select('*').eq('user_id', session.user.id).gte('due_date', todayStr).order('due_date');
    if (taskData) { setTasks(taskData); scheduleTaskReminders(taskData); }
    if (assignmentData) setAssignments(assignmentData);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setTasks([]);
    setAssignments([]);
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!session) return <SignInScreen />;

  return <HomeScreen tasks={tasks} assignments={assignments} onRefresh={loadData} onSignOut={signOut} />;
}

function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    setLoading(true);
    setError('');
    const result = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (result.error) setError(result.error.message);
    setLoading(false);
  }

  return (
    <View style={[styles.center, { backgroundColor: colors.bg, paddingTop: Platform.OS === 'android' ? 48 : 0 }]}>
      <StatusBar style="light" />
      <View style={styles.authInner}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}><Text style={styles.logoMarkText}>A</Text></View>
          <Text style={styles.logoText}>activi<Text style={{ color: colors.accent }}>fy.</Text></Text>
        </View>
        <Text style={styles.authTagline}>Your daily planner — synced across extension and mobile.</Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.text3} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.text3} value={password} onChangeText={setPassword} secureTextEntry />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleAuth} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{mode === 'signin' ? 'Sign In' : 'Create Account'}</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}>
          <Text style={styles.authNote}>{mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HomeScreen({ tasks, assignments, onRefresh, onSignOut }) {
  const todayStr = localDateStr();
  const todayTasks = tasks.filter(t => t.date === todayStr);
  const upcomingAssignments = assignments.slice(0, 5);

  return (
    <View style={[styles.flex, { backgroundColor: colors.bg }]}>
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? 48 : 16 }]}>
        <Text style={styles.headerTitle}>activi<Text style={{ color: colors.accent }}>fy.</Text></Text>
        <TouchableOpacity onPress={onSignOut}>
          <Text style={styles.signOutBtn}>Sign out</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        data={[]}
        renderItem={null}
        ListHeaderComponent={() => (
          <>
            <Text style={styles.sectionLabel}>TODAY'S TASKS</Text>
            {todayTasks.length === 0
              ? <Text style={styles.emptyState}>No tasks today — add some in the extension.</Text>
              : todayTasks.map(task => <TaskRow key={task.id} task={task} />)
            }
            <Text style={[styles.sectionLabel, { marginTop: 24 }]}>UPCOMING</Text>
            {upcomingAssignments.length === 0
              ? <Text style={styles.emptyState}>No upcoming assignments.</Text>
              : upcomingAssignments.map(a => <AssignmentRow key={a.id} assignment={a} />)
            }
          </>
        )}
      />
    </View>
  );
}

function TaskRow({ task }) {
  const timeStr = task.start_time
    ? fmtTime(task.start_time) + (task.duration_mins ? ` · ${task.duration_mins}min` : '')
    : null;
  return (
    <View style={[styles.card, task.completed && { opacity: 0.4 }]}>
      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, task.completed && styles.cardTitleDone]}>{task.title}</Text>
        {timeStr && <Text style={styles.cardMeta}>{timeStr}</Text>}
      </View>
    </View>
  );
}

function AssignmentRow({ assignment }) {
  const sourceColor = { google_classroom: '#4285f4', canvas: '#e66000', schoology: '#5a3e85' }[assignment.source] || colors.text3;
  return (
    <View style={styles.card}>
      <View style={[styles.sourceBar, { backgroundColor: sourceColor }]} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{assignment.title}</Text>
        <Text style={styles.cardMeta}>{assignment.course} · Due {assignment.due_date}</Text>
      </View>
    </View>
  );
}

function fmtTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

const styles = StyleSheet.create({
  flex:          { flex: 1 },
  center:        { flex: 1, alignItems: 'center', justifyContent: 'center' },
  authInner:     { width: '100%', paddingHorizontal: 32, alignItems: 'center', gap: 12 },
  logoRow:       { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  logoMark:      { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  logoMarkText:  { color: '#fff', fontWeight: '700', fontSize: 18 },
  logoText:      { color: colors.text, fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  authTagline:   { color: colors.text2, fontSize: 14, textAlign: 'center', lineHeight: 22, maxWidth: 260, marginBottom: 8 },
  input:         { width: '100%', backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, color: colors.text, fontSize: 14 },
  primaryBtn:    { backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24, width: '100%', alignItems: 'center' },
  primaryBtnText:{ color: '#fff', fontWeight: '700', fontSize: 15 },
  errorText:     { color: colors.warn, fontSize: 12, textAlign: 'center' },
  authNote:      { color: colors.text3, fontSize: 12, textAlign: 'center', maxWidth: 220 },
  header:        { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle:   { color: colors.text, fontSize: 20, fontWeight: '700', letterSpacing: -0.5 },
  signOutBtn:    { color: colors.text3, fontSize: 13 },
  scroll:        { paddingHorizontal: 16, paddingBottom: 40 },
  sectionLabel:  { color: colors.text3, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginTop: 4 },
  emptyState:    { color: colors.text3, fontSize: 13, paddingVertical: 12 },
  card:          { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 12, marginBottom: 8, flexDirection: 'row', gap: 10 },
  sourceBar:     { width: 3, borderRadius: 3 },
  cardBody:      { flex: 1 },
  cardTitle:     { color: colors.text, fontSize: 13, fontWeight: '500' },
  cardTitleDone: { textDecorationLine: 'line-through', color: colors.text3 },
  cardMeta:      { color: colors.text3, fontSize: 11, marginTop: 3 },
});