import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CheckoutForm } from './CheckoutForm'

describe('CheckoutForm', () => {
  const submit = vi.fn()

  beforeEach(() => {
    submit.mockClear()
  })

  it('renders the name and email fields the user sees', () => {
    render(<CheckoutForm onSubmit={submit} />)

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Place order' })).toBeEnabled()
  })

  it('submits the typed values', async () => {
    const user = userEvent.setup()
    render(<CheckoutForm onSubmit={submit} />)

    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.click(screen.getByRole('button', { name: 'Place order' }))

    expect(submit).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    })
  })

  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup()
    render(<CheckoutForm onSubmit={submit} />)

    await user.click(screen.getByRole('button', { name: 'Place order' }))

    expect(screen.getByText('Name is required.')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()
    expect(submit).not.toHaveBeenCalled()
  })

  it('shows no error after the user fixes the invalid values', async () => {
    const user = userEvent.setup()
    render(<CheckoutForm onSubmit={submit} />)

    // act: submit empty → errors appear
    await user.click(screen.getByRole('button', { name: 'Place order' }))
    expect(screen.getByText('Name is required.')).toBeInTheDocument()

    // act: fix both fields and submit again
    await user.type(screen.getByLabelText('Name'), 'Grace Hopper')
    await user.type(screen.getByLabelText('Email'), 'grace@example.com')
    await user.click(screen.getByRole('button', { name: 'Place order' }))

    // assert: the conditional errors are gone — queryBy returns null
    expect(screen.queryByText('Name is required.')).not.toBeInTheDocument()
    expect(screen.queryByText('Enter a valid email address.')).not.toBeInTheDocument()
    expect(submit).toHaveBeenCalledWith({
      name: 'Grace Hopper',
      email: 'grace@example.com',
    })
  })

  it('keeps every character when the user types rapidly', async () => {
    const user = userEvent.setup()
    render(<CheckoutForm onSubmit={submit} />)

    const nameField = screen.getByLabelText('Name')
    await user.type(nameField, 'Grace')
    await user.type(nameField, ' Hopper')

    expect(nameField).toHaveValue('Grace Hopper')
  })
})
