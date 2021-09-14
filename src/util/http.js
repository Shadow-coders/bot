function bold(text) {
  return `**${text}**`;
}
const getext = (code, text) => {
  return `${bold(code)}, \n ${text}`;
};
module.exports = {
  401:
    "**401**, Unauthorised, missing acceass ex. \n" +
    JSON.stringify({ status: 401, error: "no auth key found" }),
  400: "**400** bad request, unhandled error",
  500: "**500**, internal server error ex. typeError: foo is not defined at ...",
  404: `**404**, not found the page you were looking for does not exist`,
  200: "**200**, OK everythings good, this is the **normal** status codes for sites",
  201: "**201**, created, this means that something was created",
  300: "**300** continue, you need to contnue on to the next page",
  405:
    "**405**, method not allowed, ex. " +
    JSON.stringify({
      status: 405,
      error: "only methods POST and GET are allowed",
    }),
  403:
    "**403**, i got it but it is rejected ex. " +
    JSON.stringify({
      status: 403,
      error: "the database is closed, open it to add data ",
    }),
  101: "**101**, Switching protocols",
  102: `${bold(102)}, Processing`,
  202: gettext(202, "ACCEPTED"),
  203: gettext(203, "NON-AUTHORITATIVE INFORMATION"),
};
