import { Outlet } from 'react-router-dom'
import Navbar from "./Navbar";
// import Footer from './Footer'

export default function RootLayout() {
  return (
    <>
     <Navbar /> 
      <main style={{ minHeight: 'calc(100vh - 128px)' }}>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  )
}
