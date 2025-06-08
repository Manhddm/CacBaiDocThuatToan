# Hợp nhất Tập hợp Rời rạc (Disjoint Set Union - DSU)

Cấu trúc dữ liệu DSU (Disjoint Set Union), còn gọi là Union Find, là một cấu trúc dữ liệu mạnh mẽ cho phép quản lý các tập hợp rời rạc và thực hiện các phép hợp nhất (union) cũng như truy vấn đại diện (find) của mỗi tập hợp một cách hiệu quả.

---

## 1. Giới thiệu

DSU cung cấp ba thao tác cơ bản:
- `make_set(v)`: Tạo một tập hợp mới chỉ chứa phần tử `v`.
- `union_sets(a, b)`: Hợp nhất hai tập hợp chứa `a` và `b`.
- `find_set(v)`: Trả về đại diện (leader) của tập hợp chứa `v`. Hai phần tử thuộc cùng một tập hợp khi và chỉ khi `find_set(a) == find_set(b)`.

Các thao tác này có thể được thực hiện gần như $O(1)$ trung bình nhờ các tối ưu hóa.

---

## 2. Xây dựng cấu trúc dữ liệu hiệu quả

### 2.1. Biểu diễn bằng cây

Mỗi tập hợp được biểu diễn bằng một cây, với mảng `parent[]` lưu cha của mỗi đỉnh. Đại diện là gốc của cây.

![Ví dụ biểu diễn các tập hợp bằng cây](https://cp-algorithms.com/data_structures/DSU_example.png)

Ở ví dụ trên, ban đầu mỗi phần tử là một tập hợp riêng biệt. Sau đó, các tập hợp được hợp nhất dần lại với nhau.

### 2.2. Cài đặt cơ bản (Naive implementation)

```cpp
void make_set(int v) {
    parent[v] = v;
}

int find_set(int v) {
    if (v == parent[v])
        return v;
    return find_set(parent[v]);
}

void union_sets(int a, int b) {
    a = find_set(a);
    b = find_set(b);
    if (a != b)
        parent[b] = a;
}
```

Cài đặt này có thể dẫn đến cây suy biến thành chuỗi dài, khiến truy vấn tệ nhất $O(n)$.

### 2.3. Tối ưu hóa nén đường đi (Path compression)

Khi gọi `find_set(v)`, ta gán trực tiếp cha của mọi đỉnh trên đường đi về gốc thành gốc, giúp rút ngắn đường đi cho các lần truy vấn sau.

![Minh họa nén đường đi khi gọi find_set(7)](https://cp-algorithms.com/data_structures/DSU_path_compression.png)

```cpp
int find_set(int v) {
    if (v == parent[v])
        return v;
    return parent[v] = find_set(parent[v]);
}
```

Tối ưu này giúp giảm trung bình xuống $O(\log n)$ cho mỗi truy vấn.

### 2.4. Hợp nhất theo kích thước hoặc hạng (Union by size/rank)

Thay vì luôn gắn cây này vào cây kia, ta luôn gắn cây nhỏ hơn vào cây lớn hơn (theo kích thước hoặc hạng - rank).

**Theo kích thước:**
```cpp
void make_set(int v) {
    parent[v] = v;
    size[v] = 1;
}

void union_sets(int a, int b) {
    a = find_set(a);
    b = find_set(b);
    if (a != b) {
        if (size[a] < size[b])
            swap(a, b);
        parent[b] = a;
        size[a] += size[b];
    }
}
```

**Theo hạng (rank):**
```cpp
void make_set(int v) {
    parent[v] = v;
    rank[v] = 0;
}

void union_sets(int a, int b) {
    a = find_set(a);
    b = find_set(b);
    if (a != b) {
        if (rank[a] < rank[b])
            swap(a, b);
        parent[b] = a;
        if (rank[a] == rank[b])
            rank[a]++;
    }
}
```

Hai tối ưu này tương đương về độ phức tạp.

### 2.5. Độ phức tạp

Kết hợp cả nén đường đi và hợp nhất theo kích thước/hạng, mọi thao tác đều có độ phức tạp trung bình $O(\alpha(n))$ với $\alpha(n)$ là hàm Ackermann ngược (rất nhỏ, không vượt quá 4 với mọi $n$ thực tế).

Nếu chỉ hợp nhất theo kích thước/hạng mà không nén đường đi: $O(\log n)$.

### 2.6. Hợp nhất ngẫu nhiên (Linking by index/coin-flip)

Có thể gán cho mỗi tập hợp một chỉ số ngẫu nhiên, khi hợp nhất thì gắn tập hợp có chỉ số nhỏ hơn vào tập hợp có chỉ số lớn hơn. Độ phức tạp tương đương hợp nhất theo kích thước nhưng thực tế chậm hơn.

```cpp
void make_set(int v) {
    parent[v] = v;
    index[v] = rand();
}

void union_sets(int a, int b) {
    a = find_set(a);
    b = find_set(b);
    if (a != b) {
        if (index[a] < index[b])
            swap(a, b);
        parent[b] = a;
    }
}
```

Nếu chỉ dùng coin-flip (ngẫu nhiên chọn bên nào làm gốc), độ phức tạp thực tế kém hơn rõ rệt.

---

## 3. Ứng dụng và mở rộng

### 3.1. Tìm thành phần liên thông trong đồ thị

DSU giúp kiểm tra hai đỉnh có cùng thành phần liên thông không, thêm cạnh, thêm đỉnh với thời gian gần như hằng số. Ứng dụng trong thuật toán Kruskal tìm cây khung nhỏ nhất.

### 3.2. Tìm thành phần liên thông trong ảnh

Duyệt từng pixel trắng, với mỗi pixel kiểm tra 4 láng giềng, nếu cùng màu thì hợp nhất. DSU giúp xác định các thành phần liên thông trắng.

### 3.3. Lưu thông tin bổ sung cho mỗi tập hợp

Có thể lưu kích thước, tổng, hoặc bất kỳ thông tin nào tại đại diện của tập hợp.

### 3.4. Nén bước nhảy trên đoạn / Tô màu đoạn offline

Cho mảng độ dài $L$, mỗi truy vấn $(l, r, c)$ tô màu đoạn $[l, r]$ thành màu $c$. Duyệt ngược các truy vấn, DSU giúp tìm nhanh ô chưa tô tiếp theo trong đoạn.

```cpp
for (int i = 0; i <= L; i++) make_set(i);
for (int i = m-1; i >= 0; i--) {
    int l = query[i].l, r = query[i].r, c = query[i].c;
    for (int v = find_set(l); v <= r; v = find_set(v)) {
        answer[v] = c;
        parent[v] = v + 1;
    }
}
```

### 3.5. Lưu khoảng cách tới đại diện

Có thể lưu thêm khoảng cách từ mỗi đỉnh tới đại diện để hỗ trợ các bài toán đặc biệt.

```cpp
void make_set(int v) {
    parent[v] = make_pair(v, 0);
    rank[v] = 0;
}
pair<int, int> find_set(int v) {
    if (v != parent[v].first) {
        int len = parent[v].second;
        parent[v] = find_set(parent[v].first);
        parent[v].second += len;
    }
    return parent[v];
}
```

### 3.6. Kiểm tra tính hai phía (bipartite) online

Lưu thêm parity (tính chẵn lẻ) đường đi tới đại diện để kiểm tra thành phần liên thông có còn là đồ thị hai phía không.

Nếu hai đỉnh cùng thành phần và cùng parity, thêm cạnh giữa chúng sẽ tạo chu trình lẻ, thành phần không còn hai phía.

```cpp
void make_set(int v) {
    parent[v] = make_pair(v, 0);
    rank[v] = 0;
    bipartite[v] = true;
}
// ...
void add_edge(int a, int b) {
    pair<int, int> pa = find_set(a);
    a = pa.first; int x = pa.second;
    pair<int, int> pb = find_set(b);
    b = pb.first; int y = pb.second;
    if (a == b) {
        if (x == y) bipartite[a] = false;
    } else {
        if (rank[a] < rank[b]) swap(a, b);
        parent[b] = make_pair(a, x^y^1);
        bipartite[a] &= bipartite[b];
        if (rank[a] == rank[b]) ++rank[a];
    }
}

bool is_bipartite(int v) {
    return bipartite[find_set(v).first];
}
```

### 3.7. RMQ offline (Arpa's trick)

Duyệt mảng, với mỗi vị trí $i$ trả lời các truy vấn $(L, R)$ với $R = i$ bằng cách DSU hóa các vị trí nhỏ hơn có giá trị lớn hơn $a[i]$.

```cpp
stack<int> s;
for (int i = 0; i < n; i++) {
    while (!s.empty() && a[s.top()] > a[i]) {
        parent[s.top()] = i;
        s.pop();
    }
    s.push(i);
    for (Query q : container[i]) {
        answer[q.idx] = a[find_set(q.L)];
    }
}
```

### 3.8. Lưu DSU bằng danh sách phần tử

Lưu mỗi tập hợp là một danh sách các phần tử, khi hợp nhất thì gộp danh sách nhỏ vào lớn. Độ phức tạp $O(m + n \log n)$ với $m$ truy vấn trên $n$ phần tử.

```cpp
vector<int> lst[MAXN];
int parent[MAXN];
void make_set(int v) {
    lst[v] = vector<int>(1, v);
    parent[v] = v;
}
int find_set(int v) { return parent[v]; }
void union_sets(int a, int b) {
    a = find_set(a); b = find_set(b);
    if (a != b) {
        if (lst[a].size() < lst[b].size()) swap(a, b);
        while (!lst[b].empty()) {
            int v = lst[b].back(); lst[b].pop_back();
            parent[v] = a; lst[a].push_back(v);
        }
    }
}
```

### 3.9. Lưu DSU với cây rõ ràng / Tìm cầu online

Có thể lưu song song mảng cha nén và cha thực để hỗ trợ các bài toán như tìm cầu online.

---

## 4. Lịch sử phát triển

- DSU được mô tả lần đầu bởi Galler và Fisher (1964).
- Tối ưu nén đường đi và hợp nhất theo hạng phát triển bởi McIlroy, Morris, Tritter.
- Hopcroft và Ullman (1973) chứng minh độ phức tạp $O(\log^* n)$.
- Tarjan (1975) chứng minh $O(\alpha(n))$.
- Fredman và Sachs (1989) chứng minh không thể tốt hơn $O(\alpha(n))$ trung bình.

---

## 5. Bài tập luyện tập
- [TIMUS - Anansi's Cobweb](http://acm.timus.ru/problem.aspx?space=1&num=1671)
- [Codeforces - Roads not only in Berland](http://codeforces.com/contest/25/problem/D)
- [TIMUS - Parity](http://acm.timus.ru/problem.aspx?space=1&num=1003)
- [SPOJ - Strange Food Chain](http://www.spoj.com/problems/CHAIN/)
- [SPOJ - COLORFUL ARRAY](https://www.spoj.com/problems/CLFLARR/)
- [SPOJ - Consecutive Letters](https://www.spoj.com/problems/CONSEC/)
- [Toph - Unbelievable Array](https://toph.co/p/unbelievable-array)
- [HackerEarth - Lexicographically minimal string](https://www.hackerearth.com/practice/data-structures/disjoint-data-strutures/basics-of-disjoint-data-structures/practice-problems/algorithm/lexicographically-minimal-string-6edc1406/description/)
- [HackerEarth - Fight in Ninja World](https://www.hackerearth.com/practice/algorithms/graphs/breadth-first-search/practice-problems/algorithm/containers-of-choclates-1/)

---

## 6. Tham khảo
- [Bản gốc tiếng Anh trên CP-Algorithms](https://cp-algorithms.com/data_structures/disjoint_set_union.html)
- Bản quyền: [CC BY-SA 4.0](https://github.com/cp-algorithms/cp-algorithms/blob/main/LICENSE)

---

*Dịch và biên soạn bởi CacBaiDocThuatToan*
