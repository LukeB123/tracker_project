import FilterCheckBox from "@/app/_components/ui/buttons/filter-check-box";

interface AbsenceTableFiltersProps {
  statusFilter: ("Pending" | "Approved" | "Declined" | "Cancelled")[];
  setStatusFilter: React.Dispatch<
    React.SetStateAction<("Pending" | "Approved" | "Declined" | "Cancelled")[]>
  >;
}

export default function AbsenceTableFilters({
  statusFilter,
  setStatusFilter,
}: AbsenceTableFiltersProps) {
  function handlePendingClick(prompt: "show" | "hide") {
    if (prompt === "show")
      setStatusFilter((prevState) => [...prevState, "Pending"]);

    if (prompt === "hide") {
      setStatusFilter((prevState) =>
        prevState.filter((status) => status !== "Pending")
      );
    }
  }

  function handleApprovedClick(prompt: "show" | "hide") {
    if (prompt === "show")
      setStatusFilter((prevState) => [...prevState, "Approved"]);

    if (prompt === "hide") {
      setStatusFilter((prevState) =>
        prevState.filter((status) => status !== "Approved")
      );
    }
  }

  function handleDeclinedClick(prompt: "show" | "hide") {
    if (prompt === "show")
      setStatusFilter((prevState) => [...prevState, "Declined", "Cancelled"]);

    if (prompt === "hide") {
      setStatusFilter((prevState) =>
        prevState.filter(
          (status) => status !== "Declined" && status !== "Cancelled"
        )
      );
    }
  }
  return (
    <div className="flex justify-between items-center py-1 text-xs">
      <div className="basis-1/3">
        <FilterCheckBox
          filterShow={statusFilter.includes("Pending")}
          handleClick={handlePendingClick}
        >
          <p>Pending</p>
        </FilterCheckBox>
      </div>
      <div className="basis-1/3">
        <FilterCheckBox
          filterShow={statusFilter.includes("Approved")}
          handleClick={handleApprovedClick}
        >
          <p>Approved</p>
        </FilterCheckBox>
      </div>
      <div className="basis-1/3">
        <FilterCheckBox
          filterShow={statusFilter.includes("Declined")}
          handleClick={handleDeclinedClick}
        >
          <p>Declined/Cancelled</p>
        </FilterCheckBox>
      </div>
    </div>
  );
}
