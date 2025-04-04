'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Profile() {
  const [activeSection, setActiveSection] = useState('profile'); 
  const router = useRouter() 
    const[users, setUserData] = useState({})
  
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_NODE_API_URL}/api/auth/check-auth`, {
            credentials: "include",
          });
  
          if (!response.ok) {
            throw new Error("Not authenticated");
          }
          const data = await response.json();
  
          setUserData(data.user);
  
        } catch (error) {
          console.error("Auth check failed:", error);
          router.replace("/login")
        }
      };
  
      checkAuth();
    }, [router]);

  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
    profileImageFile: null
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Validation functions
  const validateName = (name: string) => /^[A-Za-z]+$/.test(name);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);
  const validatePassword = (password: string) => password.length >= 6;

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_NODE_API_URL}/api/auth/check-auth`, { 
          credentials: "include"  
        });
        const data = await response.json();

        if (response.ok) {
          setUser({
            ...data.user,
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            profileImage: data.user.profileImage || ''
          });
        } else {
          router.replace("/login")
        }
      } catch (error) {
        console.error("Auth check failed", error);
        router.replace("/login")
      }
    }
    checkAuth();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate profile fields
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts[1] || '';
    
    const newErrors = {
      firstName: validateName(firstName) ? '' : 'First name must contain only letters',
      lastName: validateName(lastName) ? '' : 'Last name must contain only letters',
      phone: validatePhone(user.phone) ? '' : 'Please enter a valid 10-digit phone number',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("name", user.name);
    formData.append("phone", user.phone);
    
    if (user.profileImageFile) {
      formData.append("profileImage", user.profileImageFile);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NODE_API_URL}/api/auth/update-profile`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setUser(prev => ({ 
          ...prev, 
          profileImage: data.imageUrl || prev.profileImage,
        }));
        LogOut()
      } else {
        toast.error(data.message || "Profile update failed.");
      }
    } catch (error) {
      console.log("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const LogOut = async() => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NODE_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        router.replace("/")
      } else {
        console.error('Logout failed:', await response.json());
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);

    // Clear previous errors
    setErrors(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));

    // Validate inputs
    let isValid = true;
    const newErrors = {
      ...errors,
      currentPassword: !passwordData.currentPassword ? 'Current password is required' : '',
      newPassword: !validatePassword(passwordData.newPassword) ? 'Password must be at least 6 characters' : '',
      confirmPassword: passwordData.newPassword !== passwordData.confirmPassword ? 'Passwords do not match' : ''
    };

    if (passwordData.currentPassword && passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
      isValid = false;
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '') || !isValid) {
      toast.error('Please fix the errors in the form');
      setIsUpdatingPassword(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NODE_API_URL}/api/auth/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email:user.email,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password updated successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.message || "Failed to update password.");
        // Handle specific backend errors
        if (data.message.includes('Current password is incorrect')) {
          setErrors(prev => ({ ...prev, currentPassword: 'Current password is incorrect' }));
        }
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Network error. Please try again later.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setUser(prev => ({ ...prev, profileImageFile: file }));
        const reader = new FileReader();
        reader.onloadend = () => {
            setUser(prev => ({ ...prev, profileImage: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (part: 'first' | 'last', value: string) => {
    const nameParts = user.name.split(' ');
    if (part === 'first') {
      setUser({ ...user, name: `${value} ${nameParts[1] || ''}`.trim() });
    } else {
      setUser({ ...user, name: `${nameParts[0] || ''} ${value}`.trim() });
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
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
          <button 
            className="w-full px-4 py-2 text-white hover:bg-purple-700 rounded-lg"
            onClick={() => {
              document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              router.replace("/login")
            }}
          >
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
                    value={user.name.split(' ')[0] || ''}
                    onChange={(e) => handleNameChange('first', e.target.value)}
                    className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-purple-700 font-bold">Last Name</label>
                  <input
                    type="text"
                    value={user.name.split(' ')[1] || ''}
                    onChange={(e) => handleNameChange('last', e.target.value)}
                    className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
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
                    maxLength={10}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-700 hover:bg-purple-500 text-white rounded-lg transition-colors mb-2"
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
                    name="cpassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  {errors.currentPassword && <p className="text-xs text-red-500 mt-1">{errors.currentPassword}</p>}
                </div>
                <div>
                  <label className="block text-purple-700 font-bold">New Password</label>
                  <input
                    type="password"
                    name="npassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="At least 6 characters"
                  />
                  {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>}
                </div>
                <div>
                  <label className="block text-purple-700 font-bold">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Re-enter new password"
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-700 hover:bg-purple-500 text-white rounded-lg transition-colors"
                    disabled={isUpdatingPassword}
                  >
                    {isUpdatingPassword ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
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