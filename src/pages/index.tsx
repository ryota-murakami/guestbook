import { signIn, signOut, useSession } from 'next-auth/react'

const Home = () => {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <main>Loading...</main>
  }

  return (
    <main>
      <h1>Guestbook</h1>
      <div>
        {session ? (<>
          <p>hi {session.user?.name}</p>
          <button onClick={() => {
            signOut().catch(console.log)
          }}>Logout
          </button>
        </>) : <button
          onClick={() => {
            signIn('discord').catch(console.log)
          }}
        >Login in with Discord
        </button>

        }
      </div>
    </main>
  )
}

export default Home