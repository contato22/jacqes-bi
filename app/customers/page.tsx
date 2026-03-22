import Header from "@/components/Header";
import PeriodFilterBar from "@/components/PeriodFilterBar";
import { contasData, marketingData } from "@/lib/data";
import CarteiraTabs from "./CarteiraTabs";

const saudavelCount      = contasData.filter((c) => c.saude === "Saudável").length;
const atencaoRiscoCount  = contasData.filter((c) => c.saude !== "Saudável").length;
const totalPendencias    = contasData.reduce((s, c) => s + c.pendencias, 0);
const totalPendenciasCriticas = contasData.reduce((s, c) => s + c.pendenciasCriticas, 0);

export default function CarteiraPage() {
  return (
    <>
      <Header
        title="Carteira"
        subtitle="Contas & Carteira — saúde, risco, oportunidade e marketing por cliente"
      />

      <PeriodFilterBar available={["mensal"]} label="Março 2026">
        <div className="page-content">
          <CarteiraTabs
            contasData={contasData}
            marketingData={marketingData}
            saudavelCount={saudavelCount}
            atencaoRiscoCount={atencaoRiscoCount}
            totalPendencias={totalPendencias}
            totalPendenciasCriticas={totalPendenciasCriticas}
          />
        </div>
      </PeriodFilterBar>
    </>
  );
}
