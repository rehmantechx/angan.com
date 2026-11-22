// Real Angan Tech service facts copied from the static service pages
// (angan-tech-website-development.html, angan-tech-digital-marketing.html,
// angan-tech-seo.html, angan-tech-content-writing.html,
// angan-tech-corporate-software.html, angan-tech-land-management.html,
// angan-tech-crm.html, angan-tech-hr-management.html,
// angan-tech-corporate-management.html). Nothing invented. No service
// has a published fixed price, so every page says price is agreed on
// discussion with the office.
// Text is short on purpose: 1-2 short lines per item, premium, less text.
// Every included item, every "what you get" line and every step is kept,
// only the wording is shortened. No item was removed.
export type ServiceDetails = {
  scope: string;
  included: { title: string; text: string }[];
  gets: string[];
  steps: { title: string; text: string }[];
  whoFor: string;
  priceNote: string;
};

const PRICE_NOTE =
  "No fixed price. Agreed on discussion with the office. Call +92 304 1111 698 or WhatsApp us.";

export const SERVICE_DETAILS: Record<string, ServiceDetails> = {
  "service-1": {
    scope:
      "A coded business or property website, mobile first, fast on a cheap Android phone.",
    included: [
      { title: "Pages, not a landing page", text: "Home, About, Projects, Properties, Blogs, Societies Guide and Contact, each a real page." },
      { title: "Search that works", text: "City, type, beds and budget filters on your real listings and projects, never a blank page." },
      { title: "Real photos first", text: "Your real project and listing photos, resized for fast loading. No AI images, no stock renders." },
      { title: "Your logo and colours", text: "Your original logo on white, in your red and dark blue brand colours, on every page." },
      { title: "Call and WhatsApp on every page", text: "Call and WhatsApp buttons in the header, in every listing card and on every project page." },
      { title: "Google ranking built in", text: "Title, description, geo tags and RealEstateAgent schema in the page head, clean page names." },
    ],
    gets: [
      "A live website on your own domain or GitHub Pages. Every page opens, every link works.",
      "A list of every page, with its link, checked by hand on phone and desktop.",
      "Your logo, photos and contact details on every page, in your colours.",
      "A search that filters your real listings, tested with your real cities and sizes.",
      "A handover note: how to add a listing, how to change a price, and who to call.",
    ],
    steps: [
      { title: "Call", text: "Call +92 304 1111 698 or WhatsApp us. We write down your pages, projects, listings and photos." },
      { title: "Design first", text: "We show you the design on a phone and on a desktop. You approve it before any code." },
      { title: "Build", text: "We build the pages in clean code, with your real photos and your real prices." },
      { title: "Check", text: "We tap every button, link and search on a real phone, and fix what is cut or broken." },
      { title: "Live", text: "We push the site live and check the live link ourselves before we hand it to you." },
    ],
    whoFor:
      "Property dealers, housing projects and small businesses in Pakistan who need a real website.",
    priceNote: PRICE_NOTE,
  },
  "service-2": {
    scope:
      "Facebook, Instagram and Google campaigns. Every ad sends the buyer to your WhatsApp or phone.",
    included: [
      { title: "One offer per campaign", text: "One thing only, for example MGH Zamindar File, or a 10 Marla house in DHA, with one price." },
      { title: "Ads in Urdu and English", text: "Plain Urdu and English ad text, with your real project photo, your real price and your phone number." },
      { title: "WhatsApp as the landing page", text: "A buyer who taps the ad lands on your WhatsApp, with a pre-filled message naming the project." },
      { title: "Audience by city and society", text: "Ads in Lahore, Karachi, Islamabad, Rawalpindi and Multan, where your buyers live." },
      { title: "Budget in your control", text: "You set the daily budget. We tell you before we start how many days it will run and what it will cost." },
      { title: "Weekly report, in plain words", text: "Every week: calls, WhatsApp messages and cost per enquiry, in a short message, not a long PDF." },
    ],
    gets: [
      "A campaign plan naming the project, the offer, the audience, the daily budget and the days.",
      "Ad text in Urdu and English, with your real photo, approved by you before anything goes live.",
      "A WhatsApp link for each ad, so you can see which ad each buyer came from.",
      "A weekly report with calls, WhatsApp messages and cost per enquiry.",
    ],
    steps: [
      { title: "Call", text: "You tell us the project, the price and the budget. We write it down in one message." },
      { title: "Plan", text: "We send you the campaign plan, audience, budget and days, for your approval." },
      { title: "Ads", text: "We write the ads and show them to you. Nothing goes live until you approve the words and the photo." },
      { title: "Live", text: "The campaign runs. Enquiries come to your WhatsApp and phone." },
      { title: "Report", text: "Every week we send you the numbers. We stop ads that bring no enquiries and put the budget on the ones that do." },
    ],
    whoFor:
      "Housing projects and property dealers with a real project and a real price, who want enquiries on WhatsApp, not just views.",
    priceNote:
      "You set the daily budget. We never spend more than the budget you approved, and we tell you the total before we start. No fixed campaign price. Call +92 304 1111 698 to agree the budget.",
  },
  "service-3": {
    scope:
      "Search engine work so your project and listings show up on Google when a buyer searches for a house, a plot or a file.",
    included: [
      { title: "One page, one search", text: "Each page targets one real search, for example \"10 Marla house DHA Lahore\" or \"MGH Zamindar File\"." },
      { title: "Your real listings on Google", text: "Every listing gets its own clean page name, its real price, its real size and its real photo." },
      { title: "Local search", text: "Your office address, phone number and city are on every page, in the page head. Google knows you are in Paragon City, Lahore." },
      { title: "Fast pages", text: "Photos resized, no heavy plugins, no WordPress, so pages open fast on a cheap Android phone." },
      { title: "Fixing what is broken", text: "We check your old site for broken links, missing titles and pages Google cannot read, and fix them one by one." },
      { title: "Monthly check, in plain words", text: "Once a month: the searches you now appear for, and how many buyers came from Google, in a short message." },
    ],
    gets: [
      "A list of the searches each page targets, with the page name next to it.",
      "Fixed titles, descriptions and schema on every page, so Google can read them.",
      "Resized photos and fast pages, checked on a phone.",
      "A monthly report naming the searches you appear for and the buyers who came from Google.",
    ],
    steps: [
      { title: "Check", text: "We open your site and your Google listing, and write down what Google can and cannot read." },
      { title: "Plan", text: "We send you the list of searches, one per page, for your approval." },
      { title: "Fix", text: "We fix titles, descriptions, page names and photos, page by page." },
      { title: "Check again", text: "We search Google ourselves and confirm your pages now appear." },
      { title: "Report", text: "Every month we send you the searches and the buyers from Google." },
    ],
    whoFor:
      "Property dealers and housing projects whose buyers search Google first, and who want those buyers to find their real listings.",
    priceNote: PRICE_NOTE,
  },
  "service-4": {
    scope:
      "Clear pages, project write-ups and articles in plain words your buyers understand, in Urdu and English, with your real facts.",
    included: [
      { title: "Project pages that answer the buyer", text: "Each project page answers five questions: where is it, who is the developer, what sizes, what is the price, and who do I call." },
      { title: "Listing descriptions that sell the house", text: "Size, beds, baths, society and nearest landmark, in two short paragraphs, so a buyer can decide in one minute." },
      { title: "Blog and news articles", text: "Articles from your real news, for example a soft launch, a new precinct or a payment plan, with the real date." },
      { title: "Urdu and English", text: "Plain English, with Urdu where your buyers read Urdu, and the same facts in both, never two different stories." },
      { title: "No copied text", text: "Every word written for your project, from your facts. No copied text from Zameen, Graana or another dealer, and no AI filler." },
      { title: "Checked before it goes live", text: "You read every page before it is published. Nothing goes live with a wrong price, size or phone number." },
    ],
    gets: [
      "Finished pages, ready to publish, in plain Urdu and English.",
      "A list of the facts each page is based on, so you can check them.",
      "Corrections made before publishing, not after a buyer has read the mistake.",
    ],
    steps: [
      { title: "Call", text: "You tell us the project and send the facts: sizes, prices, location, developer." },
      { title: "Draft", text: "We write the page and send it to you on WhatsApp to read." },
      { title: "Correct", text: "You correct any fact that is wrong. We fix it the same day." },
      { title: "Live", text: "The page goes live only after you approve the words." },
    ],
    whoFor:
      "Property dealers and housing projects who need pages buyers can actually read, in plain Urdu and English, with the right price and phone number.",
    priceNote: PRICE_NOTE,
  },
  "service-5": {
    scope:
      "Software built around how your office actually works. No more records in notebooks and WhatsApp chats.",
    included: [
      { title: "One system for your office", text: "Your staff, your files, your bookings and your payments in one place, so a file is never lost." },
      { title: "Built from your own forms", text: "We start from the forms and registers your office already uses, paper or Excel, and build around them." },
      { title: "Works on phone and computer", text: "Your team opens it on a phone at a site visit and on a computer in the office, with the same records." },
      { title: "Who did what, and when", text: "Every file, every payment and every change carries the name of the person who made it and the date." },
      { title: "Reports your boss can read", text: "Daily and monthly reports in plain tables: files sold, files booked, payments received, payments due." },
      { title: "Your data stays yours", text: "Your records are stored in your own account. We never sell them, share them or use them for another client." },
    ],
    gets: [
      "A working system, tested with your own real forms and your own real records.",
      "A login for each member of your team, with only the records they need to see.",
      "Reports in plain tables, daily and monthly.",
      "A training session for your team, in the office, in Urdu.",
    ],
    steps: [
      { title: "Call", text: "You tell us how your office works today, and show us your forms and registers." },
      { title: "Plan", text: "We write down exactly what the software will do, screen by screen, and you approve it." },
      { title: "Build", text: "We build it with your real forms, and test it with your real records." },
      { title: "Train", text: "We train your team in the office, and stay for the first week while they use it." },
      { title: "Support", text: "When something breaks, you call us. We fix it and tell you what went wrong." },
    ],
    whoFor:
      "Property offices, housing projects and small companies whose records are still in notebooks, Excel sheets and WhatsApp chats.",
    priceNote: PRICE_NOTE,
  },
  "service-6": {
    scope:
      "Plot, file and booking management for a housing project. Always know which plots are sold, booked, free, and who paid what.",
    included: [
      { title: "One record per plot and per file", text: "Size, block, status, owner name, booking date and payment history in one record. No plot is sold twice." },
      { title: "Booking in minutes", text: "Buyer name, CNIC number, plot size, block, total price, down payment and installment plan, plus a printed booking slip." },
      { title: "Payments, installment by installment", text: "Each payment is entered against the file, with date, amount and receipt number. The system shows what is paid and what is due." },
      { title: "Ballot and allotment lists", text: "Lists of booked files ready for ballot, and allotted files after ballot, printed in the order your project needs them." },
      { title: "Files that are transferred", text: "When a file changes hands, the old owner, the new owner and the date are recorded, so the history is never lost." },
      { title: "Daily cash and bank report", text: "At the end of the day, one table: money received today, by cash and by bank, and the files it belongs to." },
    ],
    gets: [
      "A plot and file register, with every plot and file in your project, and its current status.",
      "Booking slips, printed with buyer name, plot, price and payment plan.",
      "Payment history for every file, and a list of who still owes what.",
      "Ballot and allotment lists, ready to print.",
    ],
    steps: [
      { title: "Call", text: "You tell us the project, the blocks, the sizes and the payment plans." },
      { title: "List", text: "We enter your plots and files with you, and check the totals against your registers." },
      { title: "Test", text: "We book a test file, take a test payment and print a test slip, with your team watching." },
      { title: "Live", text: "Your team uses it for real bookings from the next day, with us on the phone for the first week." },
    ],
    whoFor:
      "Housing projects and dealers who sell plots and files, and who need to know, at any minute, which plot is free and which file still owes money.",
    priceNote: PRICE_NOTE,
  },
  "service-7": {
    scope:
      "A CRM that tracks every lead from the first call to the closing, so no enquiry is lost, and every dealer knows which buyer to call today.",
    included: [
      { title: "Every lead in one list", text: "Every call, every WhatsApp message and every walk-in is entered as a lead, with name, phone, city, budget and what they want." },
      { title: "Follow-up dates, not memory", text: "Each lead gets a follow-up date. Every morning the CRM shows the leads to call today, and the ones already late." },
      { title: "One lead, one owner", text: "Each lead belongs to one dealer. No two dealers call the same buyer, and no lead sits with nobody." },
      { title: "From enquiry to closing", text: "A lead moves through clear stages: new, called, visited, booked, closed, or lost, with the reason written down when it is lost." },
      { title: "WhatsApp and call from the lead", text: "Your team calls or WhatsApps the buyer straight from the lead, and the call and the message are recorded on the lead." },
      { title: "Daily report for the owner", text: "At the end of the day, one table: new leads, calls made, follow-ups done, follow-ups missed, bookings and closings." },
    ],
    gets: [
      "A lead list with every enquiry, its owner, its stage and its next follow-up date.",
      "A daily follow-up list for each dealer, showing who to call today.",
      "A daily report for the owner: new leads, calls, follow-ups, bookings and closings.",
      "A training session for your team, in the office, in Urdu.",
    ],
    steps: [
      { title: "Call", text: "You tell us how leads come to you today, by call, WhatsApp or walk-in, and how many dealers you have." },
      { title: "Setup", text: "We set up the lead stages, the follow-up rules and the dealer list with you." },
      { title: "Test", text: "We enter your real leads from the last week, and your team calls them from the CRM." },
      { title: "Live", text: "From the next day, every new lead goes into the CRM the same day it comes in." },
    ],
    whoFor:
      "Property dealers and housing projects who get enquiries on WhatsApp and by phone, and lose buyers because nobody follows up on time.",
    priceNote: PRICE_NOTE,
  },
  "service-8": {
    scope:
      "Staff records, attendance, leave and payroll in one system. Know who works for you, who is present, who is on leave, and who is paid what.",
    included: [
      { title: "One record per employee", text: "Name, CNIC number, phone, joining date, job, salary and bank account, in one record per person. No employee is paid from memory." },
      { title: "Attendance, daily", text: "Present, absent, late or on leave, marked daily, on the phone or on the computer. The month-end total is calculated from the daily marks." },
      { title: "Leave, requested and approved", text: "An employee asks for leave in the system. You approve or refuse it, with a reason. The leave balance is shown before you approve." },
      { title: "Payroll, from attendance", text: "Salary is calculated from attendance and leave, with deductions for absence shown line by line." },
      { title: "Advance and loan record", text: "Any advance given to an employee is recorded against their name, with the amount still to be recovered." },
      { title: "Monthly payroll sheet", text: "One sheet per month: every employee, their salary, their deductions and their net pay, ready to print." },
    ],
    gets: [
      "An employee record for every member of your team, with joining date, job and salary.",
      "A daily attendance register, and a monthly payroll sheet calculated from it.",
      "A leave record with balances, requests and approvals.",
      "A training session for your team, in the office, in Urdu.",
    ],
    steps: [
      { title: "Call", text: "You tell us how many staff you have, and how you pay them today." },
      { title: "List", text: "We enter your staff list with you, and check the salaries against your records." },
      { title: "Test", text: "We run one month of attendance and payroll with your real staff, and check the totals with you." },
      { title: "Live", text: "From the next month, attendance and payroll run in the system." },
    ],
    whoFor:
      "Small companies and property offices with 5 to 100 staff, who still mark attendance in a register and calculate salary by hand.",
    priceNote: PRICE_NOTE,
  },
  "service-9": {
    scope:
      "One dashboard for tasks, approvals and reporting across departments, so the owner sees what every department did today.",
    included: [
      { title: "One task list for the whole company", text: "Every task has a name, department, person, due date and status. The dashboard shows what is done, late, or has no owner." },
      { title: "Approvals in the open", text: "A payment, discount or file transfer goes for approval. The approver sees it, approves or refuses it with a reason." },
      { title: "Reports by department", text: "Each department reports the same way: what was done, what is stuck, what it needs. The owner reads them on one page." },
      { title: "Documents in one place", text: "Letters, approvals, payment slips and agreements are attached to the task or the file they belong to, so they are found in one search." },
      { title: "Meetings with decisions", text: "A meeting ends with decisions written down, each with a person and a date, and the dashboard shows which decisions are still open." },
      { title: "One dashboard for the owner", text: "One page, every morning: tasks done, tasks late, approvals waiting, and reports from every department." },
    ],
    gets: [
      "A dashboard showing tasks, approvals and reports from every department, on one page.",
      "A task list with owner, due date and status, for every department.",
      "An approval record: who asked, who approved, and when.",
      "A training session for your team, in the office, in Urdu.",
    ],
    steps: [
      { title: "Call", text: "You tell us your departments, and how work and approvals move between them today." },
      { title: "Plan", text: "We write down the task list, the approval steps and the daily report, and you approve it." },
      { title: "Build", text: "We build the dashboard around your departments, with your real tasks." },
      { title: "Live", text: "Your departments report in the system from the next week, with us on the phone for the first week." },
    ],
    whoFor:
      "Companies with more than one department, where the owner cannot see what each department did today, and approvals wait because nobody knows they are waiting.",
    priceNote: PRICE_NOTE,
  },
};
