import './globals.css'
import MenuBar from './MenuBar'
import Header from './Header'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header></Header>
       <div>
        {children}
       </div>
      <MenuBar/>
        </body>
    </html>
  )
}
