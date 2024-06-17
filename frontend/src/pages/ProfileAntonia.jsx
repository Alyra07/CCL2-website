import { useEffect, useState } from 'react';
import { useAuth } from '../AuthProvider';
import { database } from '../services/database'; // Assuming you have a database service
import Login from './Login2';

function ProfilePage() {
  const { user } = useAuth(); // Accessing user object from AuthProvider context
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [avatar_url, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');
  const placeholderImagePath = '/img/placeholder.jpg'; // Adjust path as per your project structure
  const [selectedFile, setSelectedFile] = useState(null); // State to hold selected file for avatar upload

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  const getProfile = async () => {
    try {
      const { data, error } = await database
        .from('users')
        .select('username, avatar_url, email')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error.message);
      } else {
        setUsername(data.username);
        setEmail(data.email);
        // Construct the full URL to the avatar image in Supabase storage
        setAvatarUrl(data.avatar_url ? `https://exhxjvaqrifqgyebnlkh.supabase.co/storage/v1/object/public/avatars/${data.avatar_url}` : placeholderImagePath);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      setAvatarUrl(placeholderImagePath); // Set placeholder path if error occurs
    }
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let updates = {
        id: user.id,
        email: email,
        updated_at: new Date(),
      };

      // Check if a new avatar file is selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload the selected file to Supabase storage
        const { data, error: uploadError } = await database.storage
          .from('avatars')
          .upload(filePath, selectedFile, {
            cacheControl: '3600', // Optional caching configuration
          });

        if (uploadError) {
          throw uploadError;
        }

        updates = {
          ...updates,
          avatar_url: filePath, // Update avatar_url with the new file path
        };
      }

      const { error } = await database.from('users').upsert(updates);

      if (error) {
        alert(error.message);
      } else {
        // Optionally update local state or inform user of success
        console.log('Profile updated successfully');
        if (updates.avatar_url) {
          // Update avatar_url state with the newly uploaded avatar URL
          setAvatarUrl(`https://exhxjvaqrifqgyebnlkh.supabase.co/storage/v1/${updates.avatar_url}`);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Failed to update profile');
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    try {
      const { error } = await database
        .from('users')
        .delete()
        .eq('id', user.id);

      if (error) {
        console.error('Error deleting profile:', error.message);
        alert(error.message);
      } else {
        console.log(`Profile with ID ${user.id} deleted`);
        alert('Profile deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting profile:', error.message);
      alert('Failed to delete profile');
    }
  };
  //https://exhxjvaqrifqgyebnlkh.supabase.co/storage/v1/object/public/avatars/avatars/0.9217459856400769.jpg
  //https://exhxjvaqrifqgyebnlkh.supabase.co/storage/v1/object/public/avatars/0.05501387811631586.jpg

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Store the selected file in state
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      <form onSubmit={updateProfile} className="form-widget">
        <div>
          <img
            src={avatar_url}
            alt="Avatar"
            className="avatar image"
            style={{ height: '150px', width: '150px', borderRadius: '50%' }}
          />
        </div>
        <div>
          <label htmlFor="avatar">Choose Avatar:&nbsp;</label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginBottom: '10px' }}
          />
        </div>
        <div>
          <label htmlFor="email">Email:&nbsp;</label>
          <input id="email" type="text" value={email} disabled />
        </div>
        <div>
          <label htmlFor="username">Username:&nbsp;</label>
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <button className="button block primary" type="submit" disabled={loading}>
            {loading ? 'Loading ...' : 'Update'}
          </button>
        </div>

        <div>
          <button className="button block" type="button" onClick={() => database.auth.signOut()}>
            Sign Out
          </button>
        </div>

        <button className="button block" type="button" onClick={handleDelete}>
          Delete Profile
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;