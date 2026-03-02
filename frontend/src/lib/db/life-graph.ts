export interface GraphNode {
  id: string;
  type: string;
  label: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
}

export class LifeGraphStore {
  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];

  upsertNode(node: GraphNode): void {
    const index = this.nodes.findIndex((item) => item.id === node.id);
    if (index === -1) this.nodes.push(node);
    else this.nodes[index] = node;
  }

  addEdge(edge: GraphEdge): void {
    this.edges.push(edge);
  }

  listNodes(): GraphNode[] {
    return [...this.nodes];
  }

  listEdges(): GraphEdge[] {
    return [...this.edges];
  }
}
