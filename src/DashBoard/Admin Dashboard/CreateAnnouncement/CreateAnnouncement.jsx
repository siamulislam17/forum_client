import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/AuthContext";
import UseAxiosSecure from "../../../UrlInstance/UseURlSecure";

const MakeAnnouncement = () => {
  const axiosSecure = UseAxiosSecure();
  const { toggleDarkMode } = useContext(AuthContext);

  const [form, setForm] = useState({
    authorImage: "",
    authorName: "",
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    const formDataImage = new FormData();
    formDataImage.append("image", image);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formDataImage,
        }
      );

      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, authorImage: data.data.url }));
        
      } else {
        console.error(data);
        
      }
    } catch (err) {
      console.error(err);
     
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.authorName || !form.title || !form.description) {
      Swal.fire("Error", "Please fill all required fields.", "error");
      return;
    }

    try {
      const response = await axiosSecure.post("/announcements", form);
      if (response.status === 201) {
        Swal.fire("Success", "Announcement created successfully.", "success");
        setForm({
          authorImage: "",
          authorName: "",
          title: "",
          description: "",
        });
      }
    } catch (error) {
      Swal.fire("Error", "Failed to create announcement.", "error");
      console.error(error);
    }
  };

  // Input classes for dark mode consistent styling
  const inputClass = `w-full p-3 rounded-lg border transition-colors duration-300
    ${toggleDarkMode
      ? "bg-gray-800 border-amber-400 placeholder:text-gray-400 text-white focus:border-amber-500"
      : "bg-white border-gray-300 placeholder:text-gray-500 text-gray-900 focus:border-blue-600"}`;

  return (
    <div
      className={`p-6 min-h-screen rounded-2xl shadow-2xl ${
        toggleDarkMode
          ? "bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900 text-white border-gray-700"
          : "bg-gradient-to-b from-green-100 via-blue-100 to-red-100 text-black border-gray-300"
      }`}
    >
      <h2 className="text-3xl font-semibold mb-6">Make Announcement</h2>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        <div>
          <label className="block mb-1 font-semibold" htmlFor="authorImage">
            Author Image (upload)
          </label>
          <input
            type="file"
            accept="image/*"
            id="authorImage"
            name="authorImage"
            onChange={handleImageUpload}
            className={`${inputClass} file:text-sm file:border-0 file:bg-transparent`}
          />
          {form.authorImage && (
            <img
              src={form.authorImage}
              alt="Author preview"
              className="mt-2 w-24 h-24 rounded-full object-cover"
            />
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="authorName">
            Author Name *
          </label>
          <input
            type="text"
            id="authorName"
            name="authorName"
            value={form.authorName}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="title">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="Announcement title"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className={`${inputClass} resize-none`}
            placeholder="Announcement details"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Make Announcement
        </button>
      </form>
    </div>
  );
};

export default MakeAnnouncement;
