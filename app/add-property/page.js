'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AddPropertyPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Get logged-in user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setMessage('You must be logged in.')
      return
    }

    const { error } = await supabase.from('properties').insert([{
      title,
      description,
      price: Number(price),
      user_id: user.id
    }])

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Property added!')
      setTitle('')
      setDescription('')
      setPrice('')
      router.push('/dashboard')  // or wherever you want to go next
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Add New Property</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Property Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        /><br /><br />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        /><br /><br />

        <button type="submit">Add Property</button>
      </form>
      <p>{message}</p>
    </div>
  )
}
