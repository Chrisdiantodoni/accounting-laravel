/* eslint-disable react/prop-types */
import React from "react";
import SelectComponent from "@/components/ui/Master/Select";
import Select from "@/components/ui/Select";
import Textinput from "@/components/ui/Textinput";
import useGetLedgers from "@/hooks/useGetLedgers";
import { useDebounce } from "@/hooks/useDebounce";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function EntryRow({ row, onChange, onDelete, errors }) {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const { data: ledgerData, isFetching } = useGetLedgers(debouncedSearch);

    const ledgerOptions = ledgerData?.data?.data?.map((item) => ({
        label: `[${item.ledger_code}] ${item?.ledger_name}`,
        value: item,
    }));
    console.log({ errors }, "error entry row");
    return (
        <tr className="text-sm">
            <td className="table-td py-1 px-3">
                <Select
                    value={row.type}
                    onChange={(e) => {
                        const type = e.target.value;
                        if (type == "kredit") {
                            onChange("type", e.target.value);
                            onChange("debit", "0");
                        } else {
                            onChange("type", e.target.value);
                            onChange("kredit", "0");
                        }
                    }}
                    options={[
                        { label: "Debit", value: "debit" },
                        { label: "Kredit", value: "kredit" },
                    ]}
                />
            </td>
            <td className="table-td py-1 px-3 w-72">
                <SelectComponent
                    error={errors?.ledger_id}
                    placeholder={"Pilih Perkiraan"}
                    value={row.ledger}
                    options={ledgerOptions}
                    onInputChange={(e) => setSearch(e)}
                    isLoading={isFetching}
                    onChange={(val) => onChange("ledger", val)}
                />
            </td>
            <td className="table-td py-1 px-3">
                <Textinput
                    error={errors?.debit}
                    placeholder=""
                    disabled={row.type == "kredit" ? true : false}
                    value={row.debit}
                    onChange={(e) => onChange("debit", e.target.value)}
                    isMask
                    options={{
                        numeral: true,
                        numeralThousandsGroupStyle: "thousand",
                        delimiter: ".",
                        numeralDecimalMark: ",",
                    }}
                />
            </td>
            <td className="table-td py-1 px-3">
                <Textinput
                    placeholder=""
                    disabled={row.type == "debit" ? true : false}
                    value={row.credit}
                    error={errors?.credit}
                    onChange={(e) => onChange("credit", e.target.value)}
                    isMask
                    options={{
                        numeral: true,
                        numeralThousandsGroupStyle: "thousand",
                        delimiter: ".",
                        numeralDecimalMark: ",",
                    }}
                />
            </td>
            <td className="table-td py-1 px-3 w-60">
                <Textinput
                    placeholder="Keterangan..."
                    value={row.notes}
                    error={errors?.notes}
                    onChange={(e) => onChange("notes", e.target.value)}
                />
            </td>
            <td className="table-td py-1 px-3 flex justify-center items-center pt-2">
                <Button
                    icon="mdi:trash"
                    className="btn-danger p-1"
                    onClick={onDelete}
                />
            </td>
        </tr>
    );
}
