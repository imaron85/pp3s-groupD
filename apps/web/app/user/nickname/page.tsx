const Nickname = () => {
  return (
    <form className="w-full flex-col flex justify-center items-center h-screen mx-auto">
      <div className="flex mb-2 space-x-2 rtl:space-x-reverse">
        <input className="block h-16 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
      </div>
      <p
        id="helper-text-explanation"
        className="mt-2 text-sm text-gray-500 dark:text-gray-400"
      >
        Please Enter Nickname
      </p>
      <button className="px-4 py-3 w-60 rounded-lg text-white mt-7 bg-slate-700">
        Start Game
      </button>
    </form>
  );
};

export default Nickname;
