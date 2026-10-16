"""Stamp the shared head, header and footer partials into every page.

The site is plain static HTML, so the shared chrome lives in /partials and is
copied between marker comments in each page:

    <!-- site-head:start -->   ... <!-- site-head:end -->
    <!-- site-header:start --> ... <!-- site-header:end -->
    <!-- site-footer:start --> ... <!-- site-footer:end -->

Run from the repository root after editing a partial:

    python tools/build_partials.py

The nav item for the current section gets aria-current="page".
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PARTIALS = ROOT / "partials"

# Which nav item is "current" for a given page path (relative to ROOT).
SECTION_FOR = [
    ("store/", "store"),
    ("freelancers/", "freelancers"),
    ("blog/", "blog"),
]

SKIP_DIRS = {"partials", "assets", "tools", ".git", "node_modules"}


def section_of(rel: str) -> str | None:
    for prefix, key in SECTION_FOR:
        if rel.startswith(prefix):
            return key
    return None


def indent(block: str, pad: str) -> str:
    return "\n".join((pad + line) if line.strip() else "" for line in block.strip("\n").splitlines())


def stamp(html: str, name: str, block: str) -> tuple[str, int]:
    pattern = re.compile(
        r"(?P<pad>[ \t]*)<!-- site-%s:start -->.*?<!-- site-%s:end -->" % (name, name), re.S
    )

    def repl(m: re.Match) -> str:
        pad = m.group("pad")
        return f"{pad}<!-- site-{name}:start -->\n{indent(block, pad)}\n{pad}<!-- site-{name}:end -->"

    return pattern.subn(repl, html)


def main() -> None:
    head = (PARTIALS / "head.html").read_text(encoding="utf-8")
    header = (PARTIALS / "header.html").read_text(encoding="utf-8")
    footer = (PARTIALS / "footer.html").read_text(encoding="utf-8")

    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT).as_posix()
        if rel.split("/")[0] in SKIP_DIRS:
            continue
        html = path.read_text(encoding="utf-8")
        if "<!-- site-header:start -->" not in html and "<!-- site-head:start -->" not in html:
            continue

        page_header = header
        current = section_of(rel)
        if current:
            page_header = page_header.replace(
                f'data-nav="{current}"', f'data-nav="{current}" aria-current="page"'
            )

        total = 0
        for name, block in (("head", head), ("header", page_header), ("footer", footer)):
            html, n = stamp(html, name, block)
            total += n
        path.write_text(html, encoding="utf-8", newline="\n")
        print(f"stamped {total} region(s): {rel}")


if __name__ == "__main__":
    main()
