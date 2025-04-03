import Image from "next/image"
import { Heart, Users, Calendar, MapPin, Clock } from "lucide-react"

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Image
          src="/placeholder.svg?height=800&width=1600"
          alt="Community Kitchen volunteers"
          width={1600}
          height={800}
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">Our Story</h1>
          <p className="text-lg md:text-xl max-w-3xl text-gray-100">
            Nourishing our community with dignity, respect, and delicious food since 2015
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-purple-400">Our Mission</h2>
            <p className="text-lg mb-6 text-gray-300">
              At Community Kitchen, we believe that access to nutritious food is a fundamental right, not a privilege.
              Our mission is to reduce food insecurity in our community by providing meals with dignity and respect.
            </p>
            <p className="text-lg text-gray-300">
              We work to create a welcoming space where anyone can enjoy a healthy meal, regardless of their
              circumstances. Beyond addressing immediate hunger, we strive to build community connections and promote
              food education.
            </p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-500 p-4 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">15,000+</h3>
                <p className="text-gray-400">Meals Served Monthly</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-500 p-4 rounded-full mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">200+</h3>
                <p className="text-gray-400">Active Volunteers</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-500 p-4 rounded-full mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">Since 2015</h3>
                <p className="text-gray-400">Serving Our Community</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-500 p-4 rounded-full mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">3 Locations</h3>
                <p className="text-gray-400">Throughout the City</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-purple-400">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Rodriguez",
                role: "Executive Director",
                bio: "With over 15 years in nonprofit management, Maria leads our organization with passion and vision.",
              },
              {
                name: "David Chen",
                role: "Head Chef",
                bio: "A culinary expert with a background in fine dining who now uses his talents to create nutritious community meals.",
              },
              {
                name: "Aisha Johnson",
                role: "Volunteer Coordinator",
                bio: "Dedicated to building our volunteer program and ensuring everyone has a meaningful experience.",
              },
            ].map((member, index) => (
              <div key={index} className="bg-black p-6 rounded-lg">
                <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-4 overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=200&width=200&text=${member.name.charAt(0)}`}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">{member.name}</h3>
                <p className="text-purple-400 text-center mb-4">{member.role}</p>
                <p className="text-gray-400 text-center">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-purple-400">How We Work</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Food Recovery",
              description:
                "We partner with local restaurants, grocery stores, and farms to rescue surplus food that would otherwise go to waste.",
              icon: <Heart className="w-6 h-6" />,
            },
            {
              title: "Meal Preparation",
              description:
                "Our skilled chefs and volunteers transform donated ingredients into nutritious, delicious meals in our community kitchen.",
              icon: <Clock className="w-6 h-6" />,
            },
            {
              title: "Community Dining",
              description:
                "We serve meals in a dignified restaurant-style setting where everyone is welcome, regardless of their ability to pay.",
              icon: <Users className="w-6 h-6" />,
            },
          ].map((item, index) => (
            <div key={index} className="bg-gray-900 p-6 rounded-lg">
              <div className="bg-purple-500 p-3 rounded-full w-fit mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="py-16 px-4 md:px-8 bg-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community</h2>
          <p className="text-lg mb-8 text-purple-100">
            Whether you want to volunteer, donate, or simply enjoy a meal with us, there are many ways to get involved
            with Community Kitchen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/donate"
              className="bg-white text-purple-900 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Donate Now
            </a>
            <a
              href="/volunteer"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
            >
              Volunteer With Us
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

