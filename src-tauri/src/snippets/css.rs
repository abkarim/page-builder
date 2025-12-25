pub fn generate_css_snippet() -> String {
    r#"
        /* =========================================
        Minimal Safe CSS Reset
        (non-opinionated, won't override your styles)
        ========================================= */

        /* Remove default margins & paddings */
        *,
        *::before,
        *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        }

        /* Improve text rendering */
        html {
        -webkit-text-size-adjust: 100%;
        }

        /* Remove link underlines by default (optional)
        — remove this if you want default styles
        */
        a {
        text-decoration: none;
        color: inherit;
        }

        /* Make images scale properly */
        img,
        picture,
        video,
        canvas,
        svg {
        display: block;
        max-width: 100%;
        }

        /* Remove built-in button styles */
        button,
        input,
        textarea,
        select {
        font: inherit;
        background: none;
        border: none;
        outline: none;
        }

        /* Smooth scrolling */
        html:focus-within {
        scroll-behavior: smooth;
        }

        /* Inherit fonts */
        body {
        font-family: inherit;
        min-height: 100vh;
        line-height: 1.5;
        }

        /* Remove bullet style */
        ul,
        ol {
        list-style: none;
        }

        /* Ensure form elements don't shrink inside flex/ grid */
        input,
        button,
        textarea,
        select {
        min-width: 0;
        }

        /* Safe focus outline reset */
        :focus {
        outline: 2px solid #00000022;
        outline-offset: 2px;
        }

        button {
            pointer-events: cursor;
        }

    "#
    .to_string()
}
