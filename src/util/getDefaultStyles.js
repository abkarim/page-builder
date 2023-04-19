export default function getDefaultStyles() {
  return `
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.5rem;
    }

    h3 {
      font-size: 1.33rem;
    }
    
    h4 {
      font-size: 1.17rem;
    }

    h5 {
      font-size: 0.83rem;
    }

    h5 {
      font-size: 0.67rem;
    }

    button {
      background-color: black;
      border: none;
      color: white;
      padding: 10px 20px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
    }

    .columnLayout {
      display:grid;
      grid-auto-flow: column;
    }
  `;
}
