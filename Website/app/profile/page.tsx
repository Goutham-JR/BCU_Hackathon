// pages/profile.js
'use client'
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Profile() {
  const [activeSection, setActiveSection] = useState('profile');  
  const [user, setUser] = useState({})

  useEffect(() => {
      async function checkAuth() {
        try {
          const response = await fetch("http://localhost:5000/api/auth/check-auth", { credentials: "include",  })
          const data = await response.json();
  
          if (response.ok) {
            setUser(data.user)
          } else {
            setUser(null)
          }
        } catch (error) {
          console.error("Auth check failed", error)
          setUser(null)
        }
      }
      checkAuth()
    }, [])

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("email", user.email);  // Send email to identify user
    formData.append("name", user.name);
    formData.append("phone", user.phone);
    
    if (user.profileImageFile) {
      formData.append("profileImage", user.profileImageFile);
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Profile updated successfully!");
        setUser((prev) => ({ 
          ...prev, 
          profileImage: data.imageUrl || prev.profileImage,
        }));
      } else {
        alert(data.message || "Profile update failed.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
  
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Password updated successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert(data.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        setUser((prev) => ({ ...prev, profileImageFile: file })); // Store file for FormData
        const reader = new FileReader();
        reader.onloadend = () => {
            setUser((prev) => ({ ...prev, profileImage: reader.result }));
        };
        reader.readAsDataURL(file);
    }
};


  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      <Head>
        <title>User Profile</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* Sidebar */}
      <aside className="w-full md:w-64 px-4 py-8 bg-purple-900 border-r">
        <div className="flex flex-col items-center mt-6">
          <div className="relative">
            <img 
              className="w-24 h-24 rounded-full object-cover" 
              src={user.profileImage || "https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"} 
              alt="User avatar"
            />
            <label className="absolute bottom-0 right-0 bg-purple-500 p-1 rounded-full cursor-pointer">
              <input 
                type="file" 
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload} 
              />
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
          </div>
          <h4 className="mt-2 font-medium text-white">{user?.name}</h4>
          <p className="text-sm font-medium text-white">{user?.email}</p>
        </div>

        <nav className="mt-6 space-y-2">
          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full px-4 py-2 text-white rounded-lg ${
              activeSection === 'profile' ? 'bg-purple-500' : 'hover:bg-purple-700'
            }`}
          >
            Profile
          </button>
          <button className="w-full px-4 py-2 text-white hover:bg-purple-700 rounded-lg">
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-purple-700">Profile Settings</h2>
            <form onSubmit={handleProfileUpdate} className="mt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-700 font-bold">First Name</label>
                  <input
                    type="text"
                    value={user.name?.split(' ')[0]}
                    onChange={(e) => setUser({ ...user, name: `${e.target.value} ${user.name.split(' ')[1]}` })}
                    className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-purple-700 font-bold">Last Name</label>
                  <input
                    type="text"
                    value={user.name?.split(' ')[1]}
                    onChange={(e) => setUser({ ...user, name: `${user.name.split(' ')[0]} ${e.target.value}` })}
                    className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-purple-700 font-bold">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-purple-700 font-bold">Phone</label>
                  <input
                    type="tel"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
              </div>
              <div className="flex justify-center">
  <button
    type="submit"
    className="px-6 py-2 bg-purple-700 hover:bg-purple-500 text-white rounded-lg transition-colors"
  >
    Update Profile
  </button>
</div>
</form>
              {/* Password Update Card */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-bold text-purple-700 mb-4">Change Password</h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="block text-purple-700 font-bold">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-700 font-bold">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-700 font-bold">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-700 hover:bg-purple-500 text-white rounded-lg transition-colors"
                  >
                    Update Password
                  </button>
                  </div>
                </form>
              </div>            
            
          </section>
        )}
      </main>
    </div>
  );
}