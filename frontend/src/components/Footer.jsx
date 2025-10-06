import { Home } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Home className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">RoomMate</span>
              </div>
              <p className="text-muted-foreground">
                Making roommate and accommodation finding safe, easy, and
                reliable.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="/find-rooms"
                    className="hover:text-primary transition-colors"
                  >
                    Find Rooms
                  </a>
                </li>
                <li>
                  <a
                    href="/find-roommates"
                    className="hover:text-primary transition-colors"
                  >
                    Find Roommates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    List Property
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Safety Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Homiezz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
