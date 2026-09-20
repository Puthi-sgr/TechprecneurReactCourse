import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { UserDirectory } from './UserDirectory'
import type { User } from '@/types'

const fakeUsers: User[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'leanne@april.biz',
    phone: '1-770-736-8031',
    website: 'hildegard.org',
    company: { name: 'Romaguera', catchPhrase: 'Multi-layered client-server' },
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998',
    },
  },
]

describe('UserDirectory', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('waits for the data to arrive and then renders the users', async () => {
    // arrange: a slow fake network
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                json: () => Promise.resolve(fakeUsers),
              } as unknown as Response)
            }, 50)
          }),
      ),
    )

    // act: render the directory inside a router
    render(
      <MemoryRouter>
        <UserDirectory />
      </MemoryRouter>,
    )

    // assert: loading first, then the data shows up without polling
    expect(screen.queryByText('Leanne Graham')).not.toBeInTheDocument()
    const user = await screen.findByText('Leanne Graham')
    expect(user).toBeInTheDocument()
    expect(screen.getByText(/leanne@april\.biz/)).toBeInTheDocument()
  })

  it('renders the error state when the request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({ ok: false, status: 500 } as unknown as Response),
      ),
    )

    render(
      <MemoryRouter>
        <UserDirectory />
      </MemoryRouter>,
    )

    expect(
      await screen.findByText('Request failed with status 500'),
    ).toBeInTheDocument()
  })
})
