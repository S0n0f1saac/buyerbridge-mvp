'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export default function AddPropertyPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    const user = userData?.user

    console.log("Fetched user:", user)
    if (!user) {
      setMessage('You must be logged in.')
      return
    }

    let image_url = null

    if (imageFile) {
      const filename = `${uuidv4()}-${imageFile.name}`
      console.log("Uploading image:", filename)

      const { data, error } = await supabase
        .storage
        .from('property-images')
        .upload(filename, imageFile)

      if (error) {
        setMessage(`Image upload failed: ${error.message}`)
        return
      }

      const { data: urlData } = supabase
        .storage
        .from('property-images')
        .getPublicUrl(filename)

      image_url = urlData.publicUrl
      console.log("Image URL generated:", image_url)
    }

    const payload = {
      title,
      description,
      price: Number(price),
      user_id: user.id,
      image_url,
    }

    console.log("Inserting property:", payload)

    const { error: insertError } = await supabase.from('properties').insert([payload])

    if (insertError) {
      console.error("INSERT ERROR:", insertError)
      setMessage(`Error: ${insertError.message}`)
    } else {
      console.log("Insert success ✅")
      setMessage('Property added!')
      router.push('/my-properties')
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

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        /><br /><br />

        <button type="submit">Add Property</button>
      </form>
      <p>{message}</p>
    </div>
  )
}

