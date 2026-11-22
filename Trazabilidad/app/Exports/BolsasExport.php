<?php


// use Illuminate\Support\Collection;
// use Maatwebsite\Excel\Concerns\FromCollection;

// class BolsasExport implements FromCollection
// {
//     public function collection(): Collection
//     {
//         //
//     }
// }

namespace App\Exports;

use App\Models\Bolsa;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;


class BolsasExport implements 
        FromQuery,
        WithHeadings,
        WithMapping,
        WithColumnWidths,
        WithEvents,
        WithColumnFormatting
{
    use Exportable;

    protected array $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function query(): Builder
    {
        $buscar = $this->filters['buscar'] ?? '';
        $estado = $this->filters['estado'] ?? '';
        $orden = $this->filters['orden'] ?? 'created_at';
        $direccion = $this->filters['direccion'] ?? 'desc';

        return Bolsa::with('tipoBolsa:id,tipo_residuo,color')
            ->select(['id', 'codigo_barra', 'estado', 'tipo_bolsa_id', 'created_at'])
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where('codigo_barra', 'like', "%{$buscar}%");
            })
            ->when($estado !== '', function ($query) use ($estado) {
                $query->where('estado', $estado);
            })
            ->orderBy($orden, $direccion);
    }

    public function headings(): array
    {
        return [
            'Código de Bolsa',
            'Tipo de Bolsa',
            'Fecha de Creación',
            'Estado',
            'Color interno',
        ];
    }

    public function map($bolsa): array
    {
        return [
            '#' . $bolsa->codigo_barra,
            $bolsa->tipoBolsa ? $bolsa->tipoBolsa->tipo_residuo : '—',
            // $bolsa->created_at ? $bolsa->created_at->format('d/m/Y') : '—',
            $bolsa->created_at
                ? Date::dateTimeToExcel($bolsa->created_at)
                : '—',
            $bolsa->estado,
            $bolsa->tipoBolsa?->color,
        ];
    }
    
    // Para mostrar el formato día/mes/año
    public function columnFormats(): array
    {
        return [
            'C' => NumberFormat::FORMAT_DATE_DDMMYYYY,
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 22,
            'B' => 30,
            'C' => 22,
            'D' => 34,
            'E' => 14,
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event): void {
                $sheet = $event->sheet->getDelegate();
                $ultimaFila = $sheet->getHighestRow();

                $sheet->getColumnDimension('E')->setVisible(false);

                $sheet->getStyle("A1:D{$ultimaFila}")->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => 'D1D5DB'],
                        ],
                    ],
                    'alignment' => [
                        'vertical' => Alignment::VERTICAL_CENTER,
                        'wrapText' => true,
                    ],
                ]);

                $sheet->getStyle('A1:D1')->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'color' => ['rgb' => 'FFFFFF'],
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '166534'],
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                        'wrapText' => true,
                    ],
                ]);

                // Centra el contenido de la columna Tipo Bolsa, Fecha y Estado ( de B–D  )
                if ($ultimaFila >= 2) {
                    $sheet->getStyle("B2:D{$ultimaFila}")
                        ->getAlignment()
                        ->setHorizontal(Alignment::HORIZONTAL_CENTER);

                    $sheet->getStyle("A2:A{$ultimaFila}")->applyFromArray([
                        'font' => [
                            'name' => 'Consolas',
                            'bold' => true,
                            'color' => ['rgb' => '1F2937'],
                        ],
                    ]);
                }

                $sheet->getRowDimension(1)->setRowHeight(30);

                for ($fila = 2; $fila <= $ultimaFila; $fila++) {
                    $color = $sheet->getCell("E{$fila}")->getValue();
                    $color = is_string($color) ? $color : null;

                    $sheet->getStyle("A{$fila}:D{$fila}")->applyFromArray([
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['rgb' => $this->colorSuave($color)],
                        ],
                    ]);
                }
            },
        ];
    }

    private function colorSuave(?string $color): string
    {
        $hex = ltrim(trim($color ?? ''), '#');

        if (!preg_match('/^[0-9A-Fa-f]{6}$/', $hex)) {
            return 'FFFFFF';
        }

        $rojo = hexdec(substr($hex, 0, 2));
        $verde = hexdec(substr($hex, 2, 2));
        $azul = hexdec(substr($hex, 4, 2));

        $mezclaBlanca = 0.88;

        return sprintf(
            '%02X%02X%02X',
            (int) round($rojo + (255 - $rojo) * $mezclaBlanca),
            (int) round($verde + (255 - $verde) * $mezclaBlanca),
            (int) round($azul + (255 - $azul) * $mezclaBlanca),
        );
    }
}