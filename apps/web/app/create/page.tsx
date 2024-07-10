export default function CreateQuiz() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 md:p-10 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Create a New Quiz</h2>
          <p className="text-gray-500">
            Fill out the details below to build your interactive quiz.
          </p>
        </div>
        <form className="grid gap-6">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-gray-700 font-medium">
              Quiz Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter a title for your quiz"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-gray-700 font-medium">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Provide a brief description of your quiz"
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Questions</h3>
              <button
                type="button"
                className="bg-primary text-primary-foreground text-center hover:bg-primary/90 font-medium py-2 px-4 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 inline-block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Question
              </button>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="question-1"
                    className="text-gray-700 font-medium"
                  >
                    Question 1
                  </label>
                  <textarea
                    id="question-1"
                    rows={2}
                    placeholder="Enter the question text"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="answer-1-1"
                      className="text-gray-700 font-medium"
                    >
                      Answer 1
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="answer-1-1"
                        className="form-checkbox text-blue-500 rounded"
                      />
                      <input
                        id="answer-1-1"
                        type="text"
                        placeholder="Enter answer text"
                        className="border border-gray-300 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="answer-1-2"
                      className="text-gray-700 font-medium"
                    >
                      Answer 2
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="answer-1-2"
                        className="form-checkbox text-blue-500 rounded"
                      />
                      <input
                        id="answer-1-2"
                        type="text"
                        placeholder="Enter answer text"
                        className="border border-gray-300 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="answer-1-3"
                      className="text-gray-700 font-medium"
                    >
                      Answer 3
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="answer-1-3"
                        className="form-checkbox text-blue-500 rounded"
                      />
                      <input
                        id="answer-1-3"
                        type="text"
                        placeholder="Enter answer text"
                        className="border border-gray-300 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="answer-1-4"
                      className="text-gray-700 font-medium"
                    >
                      Answer 4
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="answer-1-4"
                        className="form-checkbox text-blue-500 rounded"
                      />
                      <input
                        id="answer-1-4"
                        type="text"
                        placeholder="Enter answer text"
                        className="border border-gray-300 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="question-2"
                    className="text-gray-700 font-medium"
                  >
                    Question 2
                  </label>
                  <textarea
                    id="question-2"
                    rows={2}
                    placeholder="Enter the question text"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="answer-2-1"
                      className="text-gray-700 font-medium"
                    >
                      Answer 1
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="answer-2-1"
                        className="form-checkbox text-blue-500 rounded"
                      />
                      <input
                        id="answer-2-1"
                        type="text"
                        placeholder="Enter answer text"
                        className="border border-gray-300 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="answer-2-2"
                      className="text-gray-700 font-medium"
                    >
                      Answer 2
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="answer-2-2"
                        className="form-checkbox text-blue-500 rounded"
                      />
                      <input
                        id="answer-2-2"
                        type="text"
                        placeholder="Enter answer text"
                        className="border border-gray-300 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="answer-2-3"
                      className="text-gray-700 font-medium"
                    >
                      Answer 3
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="answer-2-3"
                        className="form-checkbox text-blue-500 rounded"
                      />
                      <input
                        id="answer-2-3"
                        type="text"
                        placeholder="Enter answer text"
                        className="border border-gray-300 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="answer-2-4"
                      className="text-gray-700 font-medium"
                    >
                      Answer 4
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="answer-2-4"
                        className="form-checkbox text-blue-500 rounded"
                      />
                      <input
                        id="answer-2-4"
                        type="text"
                        placeholder="Enter answer text"
                        className="border border-gray-300 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-primary text-primary-foreground text-center hover:bg-primary/90 font-medium py-2 px-4 rounded-md"
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
