import React from "react";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center py-4 bg-slate-300 dark:bg-black text-white w-full">
      <div className="flex space-x-4">
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-700 text-blue-600"
        >
          Facebook
        </a>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500 text-pink-400"
        >
          Instagram
        </a>
        <a
          href="https://zalo.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 text-blue-400"
        >
          Zalo
        </a>
      </div>
      <div className="mt-2">
        <p>Điện thoại: 0xxxxxx897</p>
      </div>
      <p className="mt-2">© 2024 2HandStore</p>
    </footer>
  );
};

export default Footer;
