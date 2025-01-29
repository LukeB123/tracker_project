"use client";

import { TAbsenceRequestProps } from "@/util/absence";
import { useEffect, useState } from "react";
import AbsenceTableEntry from "@/app/_components/absence/absence-table-entry";
import Icon from "../ui/icons";

interface AbsenceTableProps {
  absenceRequests: TAbsenceRequestProps[];
}

export default function AbsenceTable({ absenceRequests }: AbsenceTableProps) {
  const [openRequestIds, setOpenRequestIds] = useState<number[]>([]);
  const [pendingId, setPendingId] = useState<number | undefined>();
  const [statusFilter, setStatusFilter] = useState<
    ("Pending" | "Approved" | "Declined" | "Cancelled")[]
  >(["Pending", "Approved"]);

  const filteredAbsenceRequests = absenceRequests.filter((request) =>
    statusFilter.includes(request.status)
  );

  useEffect(() => {
    setOpenRequestIds((prevState) => {
      const hiddenOpenIds: number[] = [];

      prevState.forEach((id) => {
        const openRequest = absenceRequests.find(
          (request) => request.id === id
        )!;

        if (!statusFilter.includes(openRequest.status)) hiddenOpenIds.push(id);
      });

      return prevState.filter((id) => !hiddenOpenIds.includes(id));
    });
  }, [pendingId]);

  return (
    <>
      {absenceRequests.length > 0 && (
        <div className="flex justify-center">
          <div className="flex flex-col w-1/3 min-w-96">
            <div className="bg-white fixed w-1/3 min-w-96 z-10">
              <div className="flex justify-between items-center py-1 text-xs">
                <div className="basis-1/3">
                  <div className="flex justify-start items-center">
                    {!statusFilter.includes("Pending") && (
                      <button
                        className="h-6"
                        onClick={() =>
                          setStatusFilter((prevState) => [
                            ...prevState,
                            "Pending",
                          ])
                        }
                      >
                        <Icon
                          iconName="checkBoxNotTicked"
                          color="#5F249F"
                          height=""
                          width=""
                        />
                      </button>
                    )}
                    {statusFilter.includes("Pending") && (
                      <button
                        className="h-6"
                        onClick={() => {
                          setStatusFilter((prevState) =>
                            prevState.filter((status) => status !== "Pending")
                          );

                          setOpenRequestIds((prevState) => {
                            const hiddenOpenIds: number[] = [];

                            prevState.forEach((id) => {
                              if (
                                absenceRequests.find(
                                  (request) => request.id === id
                                )!.status === "Pending"
                              )
                                hiddenOpenIds.push(id);
                            });

                            return prevState.filter(
                              (id) => !hiddenOpenIds.includes(id)
                            );
                          });
                        }}
                      >
                        <Icon
                          iconName="checkBoxTicked"
                          color="#5F249F"
                          height=""
                          width=""
                        />
                      </button>
                    )}
                    <p>Pending</p>
                  </div>
                </div>
                <div className="basis-1/3">
                  <div className="flex justify-start items-center">
                    {!statusFilter.includes("Approved") && (
                      <button
                        className="h-6"
                        onClick={() =>
                          setStatusFilter((prevState) => [
                            ...prevState,
                            "Approved",
                          ])
                        }
                      >
                        <Icon
                          iconName="checkBoxNotTicked"
                          color="#5F249F"
                          height=""
                          width=""
                        />
                      </button>
                    )}
                    {statusFilter.includes("Approved") && (
                      <button
                        className="h-6"
                        onClick={() => {
                          setStatusFilter((prevState) =>
                            prevState.filter((status) => status !== "Approved")
                          );

                          setOpenRequestIds((prevState) => {
                            const hiddenOpenIds: number[] = [];

                            prevState.forEach((id) => {
                              if (
                                absenceRequests.find(
                                  (request) => request.id === id
                                )!.status === "Approved"
                              )
                                hiddenOpenIds.push(id);
                            });

                            return prevState.filter(
                              (id) => !hiddenOpenIds.includes(id)
                            );
                          });
                        }}
                      >
                        <Icon
                          iconName="checkBoxTicked"
                          color="#5F249F"
                          height=""
                          width=""
                        />
                      </button>
                    )}
                    <p>Approved</p>
                  </div>
                </div>
                <div className="basis-1/3">
                  <div className="flex justify-start items-center">
                    {!statusFilter.includes("Declined") && (
                      <button
                        className="h-6"
                        onClick={() =>
                          setStatusFilter((prevState) => [
                            ...prevState,
                            "Declined",
                            "Cancelled",
                          ])
                        }
                      >
                        <Icon
                          iconName="checkBoxNotTicked"
                          color="#5F249F"
                          height=""
                          width=""
                        />
                      </button>
                    )}
                    {statusFilter.includes("Declined") && (
                      <button
                        className="h-6"
                        onClick={() => {
                          setStatusFilter((prevState) =>
                            prevState.filter(
                              (status) =>
                                status !== "Declined" && status !== "Cancelled"
                            )
                          );

                          setOpenRequestIds((prevState) => {
                            const hiddenOpenIds: number[] = [];

                            prevState.forEach((id) => {
                              if (
                                absenceRequests.find(
                                  (request) => request.id === id
                                )!.status === "Declined" ||
                                absenceRequests.find(
                                  (request) => request.id === id
                                )!.status === "Cancelled"
                              )
                                hiddenOpenIds.push(id);
                            });

                            return prevState.filter(
                              (id) => !hiddenOpenIds.includes(id)
                            );
                          });
                        }}
                      >
                        <Icon
                          iconName="checkBoxTicked"
                          color="#5F249F"
                          height=""
                          width=""
                        />
                      </button>
                    )}
                    <p>Declined/Cancelled</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center bg-purple-600 text-grey-50 px-2 py-2 rounded-t-md text-lg font-semibold">
                <p>Request:</p>
                <p>Status:</p>
              </div>
            </div>
            <div className="h-18" />
            <ul className="w-full">
              {absenceRequests.map((request) => (
                <AbsenceTableEntry
                  key={request.id}
                  request={request}
                  openRequestIds={openRequestIds}
                  setOpenRequestIds={setOpenRequestIds}
                  pendingId={pendingId}
                  setPendingId={setPendingId}
                  hidden={
                    !filteredAbsenceRequests
                      .map((filteredRequest) => filteredRequest.id)
                      .includes(request.id)
                  }
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
