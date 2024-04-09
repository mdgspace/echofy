import React from 'react'

export default function Navbar () {
  return (
    <nav className="flex items-center justify-between h-20 px-32 border-b border-gray-300 bg-white">
        <div className="flex justify-between items-center w-1920 h-80 px-82 border-b-0.8 border-gray-300 ">
  <a href="/" className="text-182338 font-lato font-medium text-40 leading-42 tracking-0.56">.mdg</a>
</div>

<div className="flex items-start gap-8">
<div className="text-5e5e5e font-lato text-base font-medium leading-7 tracking-0.4">
    <a href="/about" className="hover:cursor-pointer hover:text-182338">Projects</a>
</div>
<div className="text-5e5e5e font-lato text-base font-medium leading-7 tracking-0.4">
    <a href="/about" className="hover:cursor-pointer hover:text-182338">Community</a>
</div>
<div className="text-5e5e5e font-lato text-base font-medium leading-7 tracking-0.4">
    <a href="/about" className="hover:cursor-pointer hover:text-182338">Podcast</a>
</div>
<div className="text-5e5e5e font-lato text-base font-medium leading-7 tracking-0.4">
    <a href="/about" className="hover:cursor-pointer hover:text-182338">About</a>
</div>
<div className="text-5e5e5e font-lato text-base font-medium leading-7 tracking-0.4">
    <a href="/about" className="hover:cursor-pointer hover:text-182338">Blog</a>
</div>




</div>

  </nav>
  )
}


