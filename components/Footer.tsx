
import { HeartIcon } from '@heroicons/react/24/solid'

export default function Footer(){
  return (
    <footer className="mt-16 py-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <HeartIcon className="w-5 h-5 text-pink-300" />
          <span>Bookmy</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a href="https://github.com/ddobroiu/bookmy" target="_blank" rel="noopener" className="hover:text-pink-200 transition">GitHub</a>
          <a href="mailto:contact@bookmy.app" className="hover:text-pink-200 transition">Contact</a>
        </div>
        <div className="text-xs text-white/80">© {new Date().getFullYear()} Bookmy — Built with <span className="text-pink-300">♥</span></div>
      </div>
    </footer>
  )
}
