"use client"
import { useEffect, useState } from 'react'
import { getSb } from '@/utils/sb'
import { Trash2, ExternalLink, Plus, Bookmark } from 'lucide-react'

export default function Home() {
  const sb = getSb()
  const [u, setU] = useState<any>(null)
  const [bms, setBms] = useState<any[]>([])
  const [url, setUrl] = useState('')
  const [ttl, setTtl] = useState('')

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      setU(session?.user ?? null)
      if (session?.user) fetchBms(session.user.id)
    })
  }, [])

  // Fix 1: Use 'uid' column to match your database
  const fetchBms = async (userId: string) => {
    const { data } = await sb.from('links').select('*').eq('uid', userId)
    if (data) setBms(data)
  }

  const login = () => sb.auth.signInWithOAuth({ 
    provider: 'google', 
    options: { redirectTo: window.location.origin + '/auth/callback' } 
  })

  const logout = () => sb.auth.signOut().then(() => window.location.reload())

  // Fix 2: Use 'link_title', 'link_url', and 'uid' columns
  const addBm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || !ttl) return
    const { error } = await sb.from('links').insert([
      { link_title: ttl, link_url: url, uid: u.id }
    ])
    if (!error) {
      setTtl(''); setUrl(''); fetchBms(u.id)
    } else {
      console.error("Error adding:", error.message)
    }
  }

  const delBm = async (id: string) => {
    await sb.from('links').delete().eq('id', id)
    fetchBms(u.id)
  }

  if (!u) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] p-10 rounded-2xl shadow-2xl border border-slate-700 text-center max-w-md w-full">
        <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bookmark className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Bookmark Hub</h1>
        <p className="text-slate-400 mb-8">Save your favorite corners of the internet.</p>
        <button onClick={login} className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-3">
          Sign in with Google
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <Bookmark className="text-blue-500 w-6 h-6" />
            <h1 className="text-2xl font-bold text-white">My Library</h1>
          </div>
          <button onClick={logout} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign Out</button>
        </header>

        <form onSubmit={addBm} className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input 
              className="bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Website Name"
              value={ttl} onChange={(e) => setTtl(e.target.value)}
            />
            <input 
              className="bg-[#0f172a] border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Website URL"
              value={url} onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
            <Plus className="w-5 h-5" /> Add Bookmark
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bms.length === 0 && <p className="text-slate-500 text-center col-span-full py-10">No bookmarks saved yet.</p>}
          {bms.map((b) => (
            <div key={b.id} className="bg-[#1e293b] border border-slate-700 p-5 rounded-xl flex justify-between items-center group hover:border-blue-500 transition-all">
              <div>
                {/* Fix 3: Display link_title and link_url */}
                <h3 className="font-bold text-white text-lg">{b.link_title}</h3>
                <p className="text-slate-400 text-sm truncate max-w-[200px]">{b.link_url}</p>
              </div>
              <div className="flex gap-2">
                <a href={b.link_url} target="_blank" className="p-2 hover:bg-slate-700 rounded-lg text-blue-400">
                  <ExternalLink className="w-5 h-5" />
                </a>
                <button onClick={() => delBm(b.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}