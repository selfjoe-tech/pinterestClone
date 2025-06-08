import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { client } from '@/sanity/client'

export const config = { api: { bodyParser: false } }

export async function POST(request) {
  try {
    // parse out both fields and file uploads via the Web API
    console.log('↪️ /api/updateProfile hit');
    const data = await request.formData()
    console.log('👍 formData parsed ok:', Array.from(data.keys()));

    const userId = data.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // collect all non-empty text fields
    const patchData = {}
    for (const key of ['userName','email','password', "bio", "instagram", "x", "youtube", "onlyfans"]) {
      const value = data.get(key)
      if (typeof value === 'string' && value.trim()) {
        if (key === 'password') {
          patchData.password = await bcrypt.hash(value.trim(), 10)
        } else {
          patchData[key] = value.trim()
        }
      }
    }

    // handle the file, if provided
    const file = data.get('profileImage')
    if (file && typeof file.stream === 'function') {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const asset = await client.assets.upload(
             'image',
             buffer,
             { filename: file.name }
           )
           patchData.profileImage = {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id }
          }
          
    }
    
    if (Object.keys(patchData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    // apply only the filled-in fields
    const updated = await client
      .patch(userId)
      .set(patchData)
      .commit({ returnDocuments: true })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('🔥 error in POST /api/updateProfile', err);
    console.error(err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}