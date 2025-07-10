'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EditPropertyPage() {
  const { id } = useParams()
  const router = useRouter()

  const [property, setProperty] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: ''
  })

  useEffect(() => {
    const fetchProperty = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching property:', error.message)
      } else {
        setProperty(data)
        setForm({
          title: data.title || '',
          description: data.description || '',
          price: data.price || ''
        })
      }
    }

    fetchProperty()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await supabase
      .from('properties')
      .update({
        title: form.title,
        description: form.description,
        price: parseFloat(form.price)
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating property:', error.message)
      alert('Update failed')
    } else {
      router.push('/my-dashboard')
    }
  }

  if (!property) return <p className="p-6 text-center">Loading...</p>

  return (
    <div className="max-w-xl mx-auto p-6 text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
          rows={4}
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full px-6 py-2 border border-black rounded hover:bg-black hover:text-white transition"
        >
          Update Property
        </button>
      </form>
    </div>
  )
}

