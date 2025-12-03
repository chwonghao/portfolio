async function loadComponent(id, file) {
  const response = await fetch(file);
  const content = await response.text();
  document.getElementById(id).innerHTML = content;
}

loadComponent("navbar", "components/navbar.html");
loadComponent("hero", "components/hero.html");
loadComponent("about", "components/about.html");
loadComponent("experience", "components/experience.html");
loadComponent("projects", "components/projects.html");
loadComponent("skills", "components/skills.html");
loadComponent("contact", "components/contact.html");
loadComponent("footer", "components/footer.html");
