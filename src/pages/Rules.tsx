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
            <div className="space-y-4 text-muted-foreground">
              
              <div className="space-y-3">
                <div>
                  <strong className="text-foreground">Karte ziehen</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Der jüngste Spieler beginnt und zieht eine Karte vom Stapel.</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-foreground">Vorlesen</strong>
                  <ul className="ml-4 mt-1 space-y-2">
                    <li>• Der Spieler liest die Karte laut vor und entscheidet sich für eine der folgenden Optionen:</li>
                    
                    <li className="ml-4">
                      <strong className="text-foreground">Option 1 – Aufgabe annehmen</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• Der Spieler führt die auf der Karte beschriebene Aufgabe aus.</li>
                        <li>• Schafft der Spieler die Aufgabe nicht, muss er die angegebene Anzahl an Schlücken trinken.</li>
                      </ul>
                    </li>

                    <li className="ml-4">
                      <strong className="text-foreground">Option 2 – Aufgabe verweigern</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• Der Spieler lehnt die Aufgabe ab und trinkt die angegebene Anzahl an Schlücken.</li>
                      </ul>
                    </li>

                    <li className="ml-4">
                      <strong className="text-foreground">Option 3 – Wild Card (falls gezogen):</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• Wild Cards dürfen behalten und später zu einem passenden Zeitpunkt ausgespielt werden.</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <strong className="text-foreground">Weitergeben</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Nach Abschluss der Aufgabe oder des Trinkens zieht der nächste Spieler eine Karte.</li>
                  </ul>
                </div>

                <div>
                  <strong className="text-foreground">Ende des Spiels</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Das Spiel endet, wenn alle Karten gespielt wurden oder die Gruppe keine Lust mehr hat.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Kartenkategorien</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-card border border-category-wildcard/50 rounded-xl p-5 space-y-2 md:col-span-2">
                <div className="flex items-center gap-3 mb-2">
                  <CategoryIcon category="Wildcard" className="w-6 h-6" />
                  <h3 className="text-xl font-semibold text-category-wildcard">Wild Cards</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Spezialkarten mit einzigartigen Effekten, die das Spiel beeinflussen können.
                </p>
              </div>

              <div className="bg-card border border-category-truth/50 rounded-xl p-5 space-y-2 md:col-span-2">
                <div className="flex items-center gap-3 mb-2">
                  <CategoryIcon category="Wahrheit" className="w-6 h-6" />
                  <h3 className="text-xl font-semibold text-category-truth">Wahrheit</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Der Spieler muss eine Frage ehrlich beantworten oder trinken.
                </p>
                <div className="text-sm text-muted-foreground ml-3 space-y-1">
                  <p><strong className="text-foreground">Unterkategorie:</strong></p>
                  <p>• „Ich habe noch nie": Wer die genannte Aktion bereits gemacht hat, muss trinken.</p>
                  <p>• „Wählt den": Die Gruppe wählt eine Person, die trinken muss.</p>
                </div>
              </div>

              <div className="bg-card border border-category-task/50 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <CategoryIcon category="Aufgabe" className="w-6 h-6" />
                  <h3 className="text-xl font-semibold text-category-task">Aufgabe</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Der Spieler muss eine Herausforderung meistern oder trinken.
                </p>
              </div>

              <div className="bg-card border border-category-group/50 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <CategoryIcon category="Gruppe" className="w-6 h-6" />
                  <h3 className="text-xl font-semibold text-category-group">Gruppe</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Alle Spieler sind betroffen und müssen gemeinsam Aufgaben bewältigen.
                </p>
              </div>

              <div className="bg-card border border-category-duel/50 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <CategoryIcon category="Duell" className="w-6 h-6" />
                  <h3 className="text-xl font-semibold text-category-duel">Duell</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Der Spieler wählt einen Gegner für einen Wettkampf. Der Verlierer trinkt.
                </p>
              </div>
            </div>
          </section>

          {/* Additional rules */}
          <section className="bg-card border border-border/50 rounded-2xl p-6 space-y-3">
            <h2 className="text-2xl font-bold text-primary">Zusätzliche Regeln</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">•</span>
                <span><strong className="text-foreground">Joker:</strong> Wild Cards dürfen jederzeit während des Spiels eingesetzt werden.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">•</span>
                <span><strong className="text-foreground">No-Chill-Regel:</strong> Bei Unklarheiten entscheidet die Gruppe demokratisch.</span>
              </li>
            </ul>
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
