'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AddPropertyPage() {
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data?.user) {
        router.push('/login')
      } else {
        setUser(data.user)
      }
    }

    checkAuth()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const user = (await supabase.auth.getUser()).data.user
    if (!user) {
      alert('You must be logged in.')
      return
    }

    const filename = `${crypto.randomUUID()}-${image.name}`
    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(filename, image)

    if (uploadError) {
      console.error('Image upload failed:', uploadError)
      return
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-images/${filename}`

    const { error } = await supabase.from('properties').insert([
      {
        user_id: user.id,
        title,
        description,
        price: parseFloat(price),
        image_url: imageUrl
      }
    ])

    if (error) {
      console.error('Property insert failed:', error)
    } else {
      router.push('/browse')
    }
  }

  if (!user) return null

  return (
    <div className="p-6 max-w-xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-4">Add New Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full border p-2 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit" className="px-6 py-2 border border-black rounded hover:bg-black hover:text-white transition">
          Add Property
        </button>
      </form>
    </div>
  )
}


