import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";

const Rules = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="icon"
            className="hover:bg-muted/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-bold">Spielregeln</h1>
        </div>

        <div className="space-y-8 slide-up">
          {/* Basic rules */}
          <section className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-primary">Grundregeln</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">Ziel des Spiels:</strong> Spaß haben und eure Freunde besser kennenlernen – mit einer Prise Alkohol!
              </p>
              <p>
                <strong className="text-foreground">Ablauf:</strong> Reihum zieht jeder Spieler eine Karte. Die Karte gibt eine Aufgabe, Frage oder Aktion vor.
              </p>
              <p>
                <strong className="text-foreground">Entscheidung:</strong> Du kannst die Aufgabe annehmen oder sie ablehnen und stattdessen die angegebene Anzahl an Schlücken trinken.
              </p>
              <p>
                <strong className="text-foreground">Spielende:</strong> Das Spiel endet, wenn alle Karten gespielt wurden oder die Gruppe beschließt aufzuhören.
              </p>
            </div>
          </section>

          {/* Categories */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Kartenkategorien</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-card border border-category-truth/50 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <CategoryIcon category="Wahrheit" className="w-6 h-6" />
                  <h3 className="text-xl font-semibold text-category-truth">Wahrheit</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Beantworte eine persönliche Frage ehrlich oder trinke die angegebenen Schlücke.
                </p>
              </div>

              <div className="bg-card border border-category-task/50 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <CategoryIcon category="Aufgabe" className="w-6 h-6" />
                  <h3 className="text-xl font-semibold text-category-task">Aufgabe</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Führe eine lustige oder herausfordernde Aufgabe aus oder trinke die Schlücke.
                </p>
              </div>

              <div className="bg-card border border-category-group/50 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <CategoryIcon category="Gruppe" className="w-6 h-6" />
                  <h3 className="text-xl font-semibold text-category-group">Gruppe</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Diese Karte betrifft alle oder mehrere Spieler. Die Anweisung auf der Karte gilt für die gesamte Gruppe.
                </p>
              </div>

              <div className="bg-card border border-category-duel/50 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <CategoryIcon category="Duell" className="w-6 h-6" />
                  <h3 className="text-xl font-semibold text-category-duel">Duell</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Fordere einen Mitspieler zu einem Wettkampf heraus. Der Verlierer trinkt die angegebenen Schlücke.
                </p>
              </div>

              <div className="bg-card border border-category-wildcard/50 rounded-xl p-5 space-y-2 md:col-span-2">
                <div className="flex items-center gap-3 mb-2">
                  <CategoryIcon category="Wildcard" className="w-6 h-6" />
                  <h3 className="text-xl font-semibold text-category-wildcard">Wildcard</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sonderaktionen! Diese Karten können Regeln ändern, Schlücke verteilen oder andere besondere Effekte haben.
                </p>
              </div>
            </div>
          </section>

          {/* Important notes */}
          <section className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 space-y-3">
            <h2 className="text-2xl font-bold text-destructive">Wichtige Hinweise</h2>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold mt-1">⚠</span>
                <span>Spielt verantwortungsvoll und kennt eure Grenzen!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold mt-1">⚠</span>
                <span>Niemand wird gezwungen, Alkohol zu trinken. Respektiert gegenseitige Grenzen.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold mt-1">⚠</span>
                <span>Fahrt niemals unter Alkoholeinfluss!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold mt-1">⚠</span>
                <span>Sorgt dafür, dass ausreichend Wasser und alkoholfreie Getränke verfügbar sind.</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Rules;
