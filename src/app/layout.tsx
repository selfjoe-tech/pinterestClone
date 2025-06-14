import type { Metadata } from "next";
import "./styles/topBar.css"
import "./styles/leftBar.css"
import "./styles/main.css"
import "./styles/UserButton.css"
import "./styles/profilePage.css"
import "./styles/gallery.css"
import "./styles/galleryItem.css"
import "./styles/collections.css"
import "./styles/postPage.css"
import "./styles/postInteractions.css"
import "./styles/comments.css"
import "./styles/createPage.css"
import "./styles/login-sign-in.css"
import LeftBar from "@/components/leftBar";
import 'bootstrap/dist/css/bootstrap.css';
import "./styles/explore.css"
import "./styles/carousel.css"
import "./styles/categories.css"
import "./styles/collage.css"

const style = {
  backgroundColor: "black"
}

export const metadata: Metadata = {
  title: "pinterestClone",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body style={style}>
        
          <LeftBar key="navBar" />
          {children}
        
      </body>
    </html>
  );
}
