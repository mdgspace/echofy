import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          In the Private mode, you message will be visible to you and admin
          only.
        </p>
        <div>
          <h1 className="title">
            Go <Link href="/chat">Private</Link>
          </h1>
          <h1 className="title">
          Go <Link href="/chat">Public</Link>
        </h1>
        </div>
      </section>
    </Layout>
  );
}
