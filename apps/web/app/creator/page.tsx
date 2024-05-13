import styles from "./page.module.css";

export default function Page(): JSX.Element {
  return (
    <main>
      <div className={styles.flexCenter}>
      <h1>Create new Kahoot</h1>
      <button>
        <p>Cancel</p>
      </button>
      <button>
        <p>Save</p>
      </button>
      </div>

      <div className={styles.quizDetails}>
      <p>Title</p>
      <input placeholder="Enter title">
      </input>
      <p>Description</p>
      <input placeholder="Enter description">
      </input>
      <p>Questions</p>
      </div>
      <div>
        <button>
          <p>Add question</p>
        </button>
      </div>
    </main>
  );
}
