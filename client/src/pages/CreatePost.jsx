import React, { useState } from 'react'
import { preview } from '../assets/index.js';
import { getRandomPrompt } from '../utils';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/FormField.jsx';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const [generatingImage, setGeneratingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generateImage, setGenerateImage] = useState(false);

  const generateImg = async () => {
    if(form.prompt) {
      try {
        setGeneratingImage(true);
        const response = await fetch('http://localhost:8080/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({prompt: form.prompt})
        })
        const data = await response.json();
        if(data?.error)
          throw data.error;
        setForm({...form, photo: `data:image/jpeg;base64,${data.photo}`});
      } catch (error) {
        setForm({...form, prompt: error.message})
      }
      finally {
        setGeneratingImage(false);
      }
    }
    else {
      alert('Please enter a prompt');
    }
  }
  const handleSubmit = async (e) => {
      e.preventDefault();
      if(form.prompt && form.photo) {
        setLoading(true);
        try {
          const response = await fetch('http://localhost:8080/api/v1/posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
          });
          await response.json();
          navigate('/');
        } catch (error) {
          alert(error);
        }
        finally {
          setLoading(false);
        }
      } else {
        alert('Please generate an image');
      }
  }
  const handleChange = (e) => {
    setForm({...form , [e.target.name]: e.target.value})
  }
  const handleSurpriseMe = (e) => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({...form, prompt: randomPrompt})
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div>
      <h1 className='font-extrabold text-[#222328] text-[32px]'>
          Create
        </h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>
          Create imaginative and visually stunning images through DALL-E AI and share them with the community
        </p>
      </div>

      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
          labelName="Your name"
          type="text"
          name="name"
          value={form.name}
          placeholder="John Doe"
          handleChange={handleChange}
          />
          <FormField
          labelName="Prompt"
          type="text"
          name="prompt"
          value={form.prompt}
          placeholder="A plush toy robot sitting against a yellow wall"
          handleChange={handleChange}
          isSurpriseMe
          handleSurpriseMe={handleSurpriseMe}
          />

          <div
            className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex items-center justify-center'
          >
            {form.photo ? (
            <img 
              src= {form.photo} 
              alt= {form.prompt} 
              className='w-full h-full object-contain'/>
            ) : (
              <img 
              src= {preview} 
              alt= "preview"
              className='w-9/12 h-9/12 object-contain opacity-40' />
            )
          }

          {generatingImage && (
            <div className='absolute inset-0 rounded-md bg-gray-800 bg-opacity-50 flex items-center justify-center'>
              <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#151dff]'></div>
            </div>
          )
          }
        </div>
        </div>

        <div className = 'mt-5 flex gap-5'>
          <button
          type='button'
          onClick={generateImg}
          className='mt-8 bg-green-700 text-white px-4 py-2 rounded-md font-medium'>
            {generatingImage ? 'Generating...' : 'Generate'}
          </button>
        </div>  
        <div className="mt-10">
          <p className='mt-2 text-[#666e75] text-[14px]'>
            Once you have created the image, you can share it with others in the community
          </p>
          <button className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
            {loading ? 'Sharing' : 'Share with the community' }
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreatePost
