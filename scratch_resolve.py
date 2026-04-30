import sys

def resolve_conflicts_keep_head(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    output = []
    in_head = False
    in_incoming = False

    for line in lines:
        if line.startswith('<<<<<<< HEAD'):
            in_head = True
            continue
        elif line.startswith('======='):
            if in_head:
                in_head = False
                in_incoming = True
                continue
        elif line.startswith('>>>>>>>'):
            if in_incoming:
                in_incoming = False
                continue
        
        if in_incoming:
            continue
        
        output.append(line)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(output)

if __name__ == '__main__':
    for file in sys.argv[1:]:
        resolve_conflicts_keep_head(file)
        print(f"Resolved {file}")
