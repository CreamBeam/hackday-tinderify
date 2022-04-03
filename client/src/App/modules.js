const eraseCookie = name => {
  document.cookie = name + '=; Max-Age=-99999999;';
};

const handleLogIn = () => window.location.href = 'http://localhost:8080/auth/'

const findCookie = (name) => document.cookie
  .split('; ')
  .find(row => row.startsWith(`${name}=`))
  .split('=')[1];

export {
  eraseCookie,
  handleLogIn,
  findCookie
}