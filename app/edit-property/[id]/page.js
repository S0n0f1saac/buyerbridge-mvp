'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function EditPropertyPage() {
  const params = useParams()
  const id = params.id
  const router = useRouter()
  const [property, setProperty] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    console.log('Editing property with ID:', id)

    const fetchProperty = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setProperty(data)
        setTitle(data.title)
        setDescription(data.description)
        setPrice(data.price)
      } else if (error) {
        console.error('Failed to fetch property:', error.message)
      }
    }

    fetchProperty()
  }, [id])

const handleUpdate = async (e) => {
  e.preventDefault()

  const propertyId = String(id)  // 👈 force it to be a string

  console.log('Submitting update:', { propertyId, title, description, price })

  // Quick check to confirm the record exists first
const { data: exists } = await supabase
  .from('properties')
  .select('id')
  .eq('id', propertyId)
  .single()

console.log('Matching record found:', exists)


const { data, error } = await supabase
  .from('properties')
  .update({
    title,
    description,
    price: Number(price)
  })
  .match({ id: propertyId })


  if (error) {
    console.error('Update failed:', error.message)
  } else {
    console.log('Update success:', data)
    router.push('/my-properties')
  }
}


  if (!property) return <p>Loading...</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Edit Property</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br /><br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        /><br /><br />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Update Property</button>
      </form>
    </div>
  )
}
