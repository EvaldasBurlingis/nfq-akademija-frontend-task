[![Netlify Status](https://api.netlify.com/api/v1/badges/84db8bca-e3de-4338-a388-5fb9cf3cc7ac/deploy-status)](https://app.netlify.com/sites/jovial-leavitt-ff4ba0/deploys)

# NFQ 2019 Rudens Stojimo užduotis FRONTEND

Šis projektas imituos priėmimo langelius, kurie yra naudojami ligoninėse, bankuose, paštuose ir t.t.

## Projekto atsisiuntimo instrukcija

Norėdami atsisiųsti šį projektą į savo kompiuterį, jame privalote turėti instaliuotą versijų kontrolės sistemą, kitaip vadinamą git.

[GIT - versijų kontrolės sistema](https://git-scm.com/)

Jei jau esate instaliavęs git, atsidarykite terminal langą kompiuteryje ir nukopijuokite komandą:

 `git clone https://github.com/EvaldasBurlingis/nfq-akademija-frontend-task.git`

 ## Failų sistema
 ```
|- css/
    |- style.css
|- js/
    |- app.js
    |- data.js
|- data/
    |- demo.json
|- index.html 
|- queue.html
|- administrator.html
|- register.html
|- management.html
 ```

## Funkcijos

* [Kliento registracija](https://evaldas-nfq.netlify.com/register.html) - Galimybė užregistruoti naują klientą, kuris bus pridėtas į laukimo eilę. Registracijos metu užpildomi laukeliai: kliento vardas, specialisto pasirinkimas, vizito priežastis. Viską užpildžius ir paspaudus registruoti mygtuka, gaunamas eilės numeris, kuris yra pridedamas į laukiančiųjų eilėje lauką. Kliento registracija ir laukimo sąrašas yra atnaujinami realiu laiku, stebint localStorage pasikeitimus, todėl yra galimybė turėti atidarytus 2 skirtingus tabus(registracija ir laukimo sąrašas) ir jie bus atnaujinti realiu laiku.


 ## Projektas sukurtas naudojant

 * [TailwindCSS](https://tailwindcss.com) - stilizuotas css dizainas, greitesniam projekto sukūrimui