import type { Metadata } from "next";

/* Identical to the former blog/index.html <head>. */
export const metadata: Metadata = {
  title: { absolute: "MitFloww Blog | Freelance Payments & Secure File Delivery" },
  description: "MitFloww blog covering freelance payment protection, secure file sharing, and why getting paid before delivery matters.",
  alternates: { canonical: "https://www.mitfloww.com/blog/" },
  openGraph: { url: "https://www.mitfloww.com/blog/" },
};

/* Same articles, order, labels and summaries as the original blog index. */
const POSTS = [
  { href: "./mitflow.html", cat: "Search intent · Brand clarification", title: "MitFlow vs MitFloww – What’s the difference?", text: "Confused between MitFlow and MitFloww? Learn the difference." },
  { href: "./freelance-payment-terms.html", cat: "Payments · Guide", title: "Freelancer Payment Terms You Should Always Use", text: "Deposits, milestones, and how to prevent non-payment." },
  { href: "./get-paid-before-delivery.html", cat: "Payments · Workflow", title: "Get Paid Before You Deliver", text: "Control delivery to eliminate payment risk." },
  { href: "./client-not-paying.html", cat: "Problem · Client risk", title: "Client Not Paying After Delivery?", text: "Why freelancers lose leverage — and how to fix it." },
  { href: "./free-sample-request.html", cat: "Client Risk · High intent", title: "Client Asking for Free Sample? Here’s What to Do", text: "Avoid unpaid work and protect your time." },
  { href: "./revision-abuse.html", cat: "Scope · Profitability", title: "Unlimited Revisions Are Killing Your Freelance Business", text: "Why “unlimited” destroys margins." },
  { href: "./freelancer-money-loss.html", cat: "Awareness · Losses", title: "How Freelancers Lose Money Without Realizing It", text: "Hidden leaks killing your income." },
  { href: "./file-sharing-methods.html", cat: "Tools · Comparison", title: "Best File Sharing Methods for Freelancers (2026)", text: "Why most tools fail to protect payments." },
  { href: "./secure-file-sharing.html", cat: "Security · Files", title: "Secure File Sharing for Freelancers", text: "Security ≠ payment protection." },
  { href: "./send-files-after-payment.html", cat: "Workflow · Delivery", title: "How to Send Files After Payment", text: "Structured delivery workflow freelancers should use." },
];

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function BlogIndex() {
  const [feature, ...rest] = POSTS;
  return (
    <main id="main" className="page-blog">
      <section className="page-hero">
        <div className="container">
          <div className="page-hero__inner">
            <p className="eyebrow" data-reveal>Resources</p>
            <h1 className="display" data-reveal style={{ ["--i" as string]: 1 }}>MitFloww Blog</h1>
            <p className="lead" data-reveal style={{ ["--i" as string]: 2 }}>Learn how freelancers protect payments, control file delivery and avoid client non-payment.</p>
          </div>
        </div>
      </section>

      <section className="container blog-list" aria-label="Articles">
        <a className="bpost bpost--feature" href={feature.href} data-reveal>
          <span className="bpost__cat">{feature.cat}</span>
          <h2 className="bpost__title">{feature.title}</h2>
          <p>{feature.text}</p>
          <span className="bpost__more">Read article <Arrow /></span>
        </a>

        <ul className="bposts" role="list">
          {rest.map((p) => (
            <li key={p.href}>
              <a className="bpost" href={p.href} data-reveal>
                <span className="bpost__cat">{p.cat}</span>
                <div className="bpost__text">
                  <h2 className="bpost__title">{p.title}</h2>
                  <p>{p.text}</p>
                </div>
                <span className="bpost__arrow"><Arrow /></span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="container blog-more" aria-labelledby="about-title">
        <div className="blog-more__grid">
          <div>
            <h2 id="about-title" className="h3">About MitFloww</h2>
            <ul className="blog-more__links" role="list">
              <li><a className="text-link" href="/what-is-mitfloww.html">What is MitFloww?</a></li>
              <li><a className="text-link" href="/mitfloww-review.html">MitFloww review</a></li>
            </ul>
          </div>
          <div className="blog-more__cta">
            <p>Want to avoid payment issues completely?</p>
            <a href="https://www.mitfloww.com/" className="btn btn--primary btn--lg">Join MitFloww →</a>
          </div>
        </div>
      </section>
    </main>
  );
}
