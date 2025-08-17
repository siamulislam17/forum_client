// src/Pages/MembershipPromo/MembershipPromo.jsx
import React from "react";
import { useNavigate } from "react-router";

const MembershipPromo = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 text-center">
      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
        Become a Member!
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Unlock full privileges: Post more than 5 discussions, access exclusive features, and engage more with the community.
      </p>
      <button
        onClick={() => navigate("/membership")}
        className="px-6 py-3  bg-purple-600 text-white rounded-full transition"
      >
        Get Membership
      </button>
    </section>
  );
};

export default MembershipPromo;
