# Định lý số dư Trung Quốc (Chinese Remainder Theorem)

## Giới thiệu

Định lý số dư Trung Quốc (Chinese Remainder Theorem - CRT) được phát hiện bởi nhà toán học Trung Quốc Tôn Tử (Sun Zi). Đây là một trong những định lý quan trọng nhất trong lý thuyết số với nhiều ứng dụng thực tế.

## Phát biểu định lý

Cho $m = m_1 \cdot m_2 \cdots m_k$, trong đó các $m_i$ nguyên tố cùng nhau từng đôi một. Ngoài các $m_i$, ta cũng được cho hệ phương trình đồng dư:

$$\left\{\begin{array}{rcl} 
a & \equiv & a_1 \pmod{m_1} \\ 
a & \equiv & a_2 \pmod{m_2} \\ 
& \vdots & \\ 
a & \equiv & a_k \pmod{m_k} 
\end{array}\right.$$

trong đó $a_i$ là các hằng số cho trước. Định lý CRT phát biểu rằng hệ phương trình đồng dư này luôn có một và chỉ một nghiệm modulo $m$.

### Ví dụ

Hệ phương trình đồng dư:

$$\left\{\begin{array}{rcl} 
a & \equiv & 2 \pmod{3} \\ 
a & \equiv & 3 \pmod{5} \\ 
a & \equiv & 2 \pmod{7} 
\end{array}\right.$$

có nghiệm $a = 23$ modulo $105$, vì $23 \bmod 3 = 2$, $23 \bmod 5 = 3$, và $23 \bmod 7 = 2$. Ta có thể viết tất cả nghiệm dưới dạng $23 + 105 \cdot k$ với $k \in \mathbb{Z}$.

### Hệ quả

Một hệ quả của CRT là phương trình:

$$x \equiv a \pmod{m}$$

tương đương với hệ phương trình:

$$\left\{\begin{array}{rcl} 
x & \equiv & a_1 \pmod{m_1} \\ 
& \vdots & \\ 
x & \equiv & a_k \pmod{m_k} 
\end{array}\right.$$

(Như trên, giả sử $m = m_1 m_2 \cdots m_k$ và các $m_i$ nguyên tố cùng nhau từng đôi một).

## Giải với hai modulo

Xét hệ hai phương trình với $m_1, m_2$ nguyên tố cùng nhau:

$$\left\{\begin{align} 
a &\equiv a_1 \pmod{m_1} \\ 
a &\equiv a_2 \pmod{m_2} 
\end{align}\right.$$

Ta muốn tìm nghiệm cho $a \pmod{m_1 m_2}$. Sử dụng thuật toán Euclidean mở rộng, ta có thể tìm các hệ số Bézout $n_1, n_2$ sao cho:

$$n_1 m_1 + n_2 m_2 = 1$$

Thực tế $n_1$ và $n_2$ chính là nghịch đảo modular của $m_1$ và $m_2$ modulo $m_2$ và $m_1$ tương ứng. Ta có $n_1 m_1 \equiv 1 \pmod{m_2}$ nên $n_1 \equiv m_1^{-1} \pmod{m_2}$, và ngược lại $n_2 \equiv m_2^{-1} \pmod{m_1}$.

Với hai hệ số này, ta có thể định nghĩa nghiệm:

$$a = a_1 n_2 m_2 + a_2 n_1 m_1 \bmod{m_1 m_2}$$

Dễ dàng kiểm tra đây thực sự là nghiệm bằng cách tính $a \bmod{m_1}$ và $a \bmod{m_2}$:

$$\begin{array}{rcll} 
a & \equiv & a_1 n_2 m_2 + a_2 n_1 m_1 & \pmod{m_1}\\ 
& \equiv & a_1 (1 - n_1 m_1) + a_2 n_1 m_1 & \pmod{m_1}\\ 
& \equiv & a_1 - a_1 n_1 m_1 + a_2 n_1 m_1 & \pmod{m_1}\\ 
& \equiv & a_1 & \pmod{m_1} 
\end{array}$$

Định lý CRT cũng đảm bảo rằng chỉ có 1 nghiệm tồn tại modulo $m_1 m_2$.

## Giải cho trường hợp tổng quát

### Phương pháp quy nạp

Vì $m_1 m_2$ nguyên tố cùng nhau với $m_3$, ta có thể áp dụng quy nạp để giải cho bất kỳ số modulo nào. Đầu tiên ta tính $b_2 := a \pmod{m_1 m_2}$ sử dụng hai phương trình đồng dư đầu, sau đó ta có thể tính $b_3 := a \pmod{m_1 m_2 m_3}$ sử dụng các phương trình đồng dư $a \equiv b_2 \pmod{m_1 m_2}$ và $a \equiv a_3 \pmod{m_3}$, v.v.

### Phương pháp xây dựng trực tiếp

Một phương pháp xây dựng trực tiếp tương tự nội suy Lagrange cũng có thể thực hiện được.

Đặt $M_i := \prod_{j \neq i} m_j$, là tích của tất cả modulo trừ $m_i$, và $N_i$ là nghịch đảo modular $N_i := M_i^{-1} \bmod{m_i}$. Khi đó nghiệm của hệ phương trình đồng dư là:

$$a \equiv \sum_{i=1}^k a_i M_i N_i \pmod{m_1 m_2 \cdots m_k}$$

Ta có thể kiểm tra đây thực sự là nghiệm bằng cách tính $a \bmod{m_i}$ cho tất cả $i$. Vì $M_j$ là bội của $m_i$ với $i \neq j$, ta có:

$$\begin{array}{rcll} 
a & \equiv & \sum_{j=1}^k a_j M_j N_j & \pmod{m_i} \\ 
& \equiv & a_i M_i N_i & \pmod{m_i} \\ 
& \equiv & a_i M_i M_i^{-1} & \pmod{m_i} \\ 
& \equiv & a_i & \pmod{m_i} 
\end{array}$$

## Triển khai code

### Cấu trúc dữ liệu

```cpp
#include <iostream>
#include <vector>
using namespace std;

struct Congruence {
    long long a, m;
};

// Thuật toán Euclidean mở rộng
long long extendedGCD(long long a, long long b, long long &x, long long &y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }
    long long x1, y1;
    long long gcd = extendedGCD(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return gcd;
}

// Nghịch đảo modular
long long modInverse(long long a, long long m) {
    long long x, y;
    long long gcd = extendedGCD(a, m, x, y);
    if (gcd != 1) return -1; // Không tồn tại nghịch đảo
    return (x % m + m) % m;
}

// CRT cho hai modulo
long long chineseRemainderTwo(long long a1, long long m1, long long a2, long long m2) {
    long long n1, n2;
    long long gcd = extendedGCD(m1, m2, n1, n2);
    
    if (gcd != 1) return -1; // Không nguyên tố cùng nhau
    
    long long result = (a1 * n2 % (m1 * m2) * m2 + a2 * n1 % (m1 * m2) * m1) % (m1 * m2);
    if (result < 0) result += m1 * m2;
    
    return result;
}

// CRT cho nhiều modulo - phương pháp quy nạp
long long chineseRemainderInductive(const vector<Congruence>& congruences) {
    if (congruences.empty()) return 0;
    
    long long a = congruences[0].a;
    long long m = congruences[0].m;
    
    for (int i = 1; i < congruences.size(); i++) {
        a = chineseRemainderTwo(a, m, congruences[i].a, congruences[i].m);
        if (a == -1) return -1; // Không có nghiệm
        m *= congruences[i].m;
    }
    
    return a;
}

// CRT cho nhiều modulo - phương pháp xây dựng trực tiếp
long long chineseRemainderDirect(const vector<Congruence>& congruences) {
    long long M = 1;
    for (const auto& congruence : congruences) {
        M *= congruence.m;
    }

    long long solution = 0;
    for (const auto& congruence : congruences) {
        long long a_i = congruence.a;
        long long M_i = M / congruence.m;
        long long N_i = modInverse(M_i, congruence.m);
        
        if (N_i == -1) return -1; // Không có nghịch đảo
        
        solution = (solution + a_i * M_i % M * N_i) % M;
    }
    
    if (solution < 0) solution += M;
    return solution;
}

// Kiểm tra nghiệm
bool verifySolution(long long x, const vector<Congruence>& congruences) {
    for (const auto& congruence : congruences) {
        if (x % congruence.m != congruence.a % congruence.m) {
            return false;
        }
    }
    return true;
}

int main() {
    vector<Congruence> congruences;
    int n;
    
    cout << "Nhập số phương trình đồng dư: ";
    cin >> n;
    
    cout << "Nhập các phương trình (a_i m_i):" << endl;
    for (int i = 0; i < n; i++) {
        long long a, m;
        cin >> a >> m;
        congruences.push_back({a, m});
    }
    
    cout << "\nPhương pháp quy nạp:" << endl;
    long long result1 = chineseRemainderInductive(congruences);
    if (result1 == -1) {
        cout << "Không có nghiệm (các modulo không nguyên tố cùng nhau)" << endl;
    } else {
        cout << "Nghiệm: x = " << result1 << endl;
        cout << "Kiểm tra: " << (verifySolution(result1, congruences) ? "Đúng" : "Sai") << endl;
    }
    
    cout << "\nPhương pháp xây dựng trực tiếp:" << endl;
    long long result2 = chineseRemainderDirect(congruences);
    if (result2 == -1) {
        cout << "Không có nghiệm" << endl;
    } else {
        cout << "Nghiệm: x = " << result2 << endl;
        cout << "Kiểm tra: " << (verifySolution(result2, congruences) ? "Đúng" : "Sai") << endl;
    }
    
    return 0;
}
```

### Code Python

```python
def extended_gcd(a, b):
    """Thuật toán Euclidean mở rộng"""
    if b == 0:
        return a, 1, 0
    gcd, x1, y1 = extended_gcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return gcd, x, y

def mod_inverse(a, m):
    """Tính nghịch đảo modular"""
    gcd, x, y = extended_gcd(a, m)
    if gcd != 1:
        return None
    return (x % m + m) % m

def chinese_remainder_two(a1, m1, a2, m2):
    """CRT cho hai modulo"""
    gcd, n1, n2 = extended_gcd(m1, m2)
    
    if gcd != 1:
        return None  # Không nguyên tố cùng nhau
    
    result = (a1 * n2 * m2 + a2 * n1 * m1) % (m1 * m2)
    return result

def chinese_remainder_inductive(congruences):
    """CRT cho nhiều modulo - phương pháp quy nạp"""
    if not congruences:
        return 0
    
    a, m = congruences[0]
    
    for i in range(1, len(congruences)):
        a_i, m_i = congruences[i]
        a = chinese_remainder_two(a, m, a_i, m_i)
        if a is None:
            return None
        m *= m_i
    
    return a

def chinese_remainder_direct(congruences):
    """CRT cho nhiều modulo - phương pháp xây dựng trực tiếp"""
    if not congruences:
        return 0
    
    # Tính tích của tất cả modulo
    M = 1
    for a, m in congruences:
        M *= m
    
    solution = 0
    for a_i, m_i in congruences:
        M_i = M // m_i
        N_i = mod_inverse(M_i, m_i)
        
        if N_i is None:
            return None
        
        solution = (solution + a_i * M_i * N_i) % M
    
    return solution

def verify_solution(x, congruences):
    """Kiểm tra nghiệm"""
    for a, m in congruences:
        if x % m != a % m:
            return False
    return True

# Ví dụ sử dụng
if __name__ == "__main__":
    print("Định lý số dư Trung Quốc")
    
    # Ví dụ 1: x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7)
    congruences1 = [(2, 3), (3, 5), (2, 7)]
    print(f"\nVí dụ 1: {congruences1}")
    
    result1 = chinese_remainder_inductive(congruences1)
    result2 = chinese_remainder_direct(congruences1)
    
    print(f"Phương pháp quy nạp: x = {result1}")
    print(f"Phương pháp xây dựng trực tiếp: x = {result2}")
    
    if result1 is not None:
        print(f"Kiểm tra nghiệm {result1}: {verify_solution(result1, congruences1)}")
        
        # Hiển thị chi tiết
        for i, (a, m) in enumerate(congruences1):
            print(f"  {result1} ≡ {result1 % m} (mod {m}), cần {a}")
    
    # Ví dụ 2: x ≡ 3 (mod 10), x ≡ 5 (mod 12)
    congruences2 = [(3, 10), (5, 12)]
    print(f"\nVí dụ 2: {congruences2}")
    
    result1 = chinese_remainder_inductive(congruences2)
    print(f"Kết quả: {'Không có nghiệm' if result1 is None else f'x = {result1}'}")
    
    # Ví dụ 3: Hệ lớn hơn
    congruences3 = [(1, 3), (4, 5), (6, 7), (0, 11)]
    print(f"\nVí dụ 3: {congruences3}")
    
    result1 = chinese_remainder_inductive(congruences3)
    result2 = chinese_remainder_direct(congruences3)
    
    print(f"Phương pháp quy nạp: x = {result1}")
    print(f"Phương pháp xây dựng trực tiếp: x = {result2}")
    
    if result1 is not None:
        print(f"Kiểm tra nghiệm {result1}: {verify_solution(result1, congruences3)}")
        
        # Hiển thị chi tiết
        M = 1
        for a, m in congruences3:
            M *= m
        print(f"Tất cả nghiệm: {result1} + {M}k với k ∈ Z")
```

## Giải cho modulo không nguyên tố cùng nhau

Như đã đề cập, thuật toán trên chỉ hoạt động cho các modulo nguyên tố cùng nhau $m_1, m_2, \ldots, m_k$.

Trong trường hợp các modulo không nguyên tố cùng nhau, hệ phương trình đồng dư có đúng một nghiệm modulo $\text{lcm}(m_1, m_2, \ldots, m_k)$, hoặc không có nghiệm nào cả.

### Ví dụ vô nghiệm

Hệ sau không có nghiệm:

$$\left\{\begin{align} 
a & \equiv 1 \pmod{4} \\ 
a & \equiv 2 \pmod{6}
\end{align}\right.$$

Phương trình đồng dư đầu tiên ngụ ý nghiệm là số lẻ, và phương trình thứ hai ngụ ý nghiệm là số chẵn. Không thể có số vừa lẻ vừa chẵn, do đó không có nghiệm.

### Phương pháp giải

Việc xác định hệ có nghiệm hay không khá đơn giản. Và nếu có nghiệm, ta có thể sử dụng thuật toán gốc để giải hệ phương trình đồng dư đã được sửa đổi một chút.

Một phương trình đồng dư $a \equiv a_i \pmod{m_i}$ tương đương với hệ phương trình đồng dư $a \equiv a_i \pmod{p_j^{n_j}}$ trong đó $p_1^{n_1} p_2^{n_2} \cdots p_k^{n_k}$ là phân tích thừa số nguyên tố của $m_i$.

### Ví dụ có nghiệm

Hệ sau có nghiệm modulo $\text{lcm}(10, 12) = 60$:

$$\left\{\begin{align} 
a & \equiv 3 \pmod{10} \\ 
a & \equiv 5 \pmod{12}
\end{align}\right.$$

Hệ phương trình đồng dư này tương đương với:

$$\left\{\begin{align} 
a & \equiv 3 \equiv 1 \pmod{2} \\ 
a & \equiv 3 \equiv 3 \pmod{5} \\ 
a & \equiv 5 \equiv 1 \pmod{4} \\ 
a & \equiv 5 \equiv 2 \pmod{3}
\end{align}\right.$$

Các phương trình đồng dư duy nhất có cùng modulo nguyên tố là $a \equiv 1 \pmod{4}$ và $a \equiv 1 \pmod{2}$. Phương trình đầu đã ngụ ý phương trình thứ hai, nên ta có thể bỏ qua phương trình thứ hai và giải hệ với các modulo nguyên tố cùng nhau:

$$\left\{\begin{align} 
a & \equiv 3 \pmod{5} \\ 
a & \equiv 1 \pmod{4} \\ 
a & \equiv 2 \pmod{3}
\end{align}\right.$$

Nghiệm là $53 \pmod{60}$, và thực sự $53 \bmod 10 = 3$ và $53 \bmod 12 = 5$.

## Thuật toán Garner

Một hệ quả khác của CRT là ta có thể biểu diễn các số lớn bằng mảng các số nguyên nhỏ.

Thay vì thực hiện nhiều phép tính với các số rất lớn, có thể tốn kém (hãy nghĩ đến việc thực hiện phép chia với các số có 1000 chữ số), bạn có thể chọn một vài modulo nguyên tố cùng nhau và biểu diễn số lớn dưới dạng hệ phương trình đồng dư, và thực hiện tất cả các phép toán trên hệ phương trình. Bất kỳ số $a$ nào nhỏ hơn $m_1 m_2 \cdots m_k$ đều có thể được biểu diễn dưới dạng mảng $a_1, \ldots, a_k$, trong đó $a \equiv a_i \pmod{m_i}$.

Bằng cách sử dụng thuật toán trên, bạn có thể khôi phục lại số lớn bất cứ khi nào cần.

Hoặc bạn có thể biểu diễn số trong hệ cơ số hỗn hợp:

$$a = x_1 + x_2 m_1 + x_3 m_1 m_2 + \ldots + x_k m_1 \cdots m_{k-1} \text{ với }x_i \in [0, m_i)$$

Thuật toán Garner, được thảo luận trong bài viết chuyên biệt về thuật toán Garner, tính toán các hệ số $x_i$. Và với những hệ số đó, bạn có thể khôi phục lại số đầy đủ.

## Ví dụ minh họa

### Ví dụ 1: Hệ ba phương trình

Giải hệ:
$$\left\{\begin{array}{rcl} 
x & \equiv & 2 \pmod{3} \\ 
x & \equiv & 3 \pmod{5} \\ 
x & \equiv & 2 \pmod{7} 
\end{array}\right.$$

**Phương pháp xây dựng trực tiếp:**
- $M = 3 \times 5 \times 7 = 105$
- $M_1 = 105/3 = 35$, $N_1 = 35^{-1} \bmod 3 = 2$
- $M_2 = 105/5 = 21$, $N_2 = 21^{-1} \bmod 5 = 1$  
- $M_3 = 105/7 = 15$, $N_3 = 15^{-1} \bmod 7 = 1$

$x = 2 \times 35 \times 2 + 3 \times 21 \times 1 + 2 \times 15 \times 1 = 140 + 63 + 30 = 233 \equiv 23 \pmod{105}$

### Ví dụ 2: Modulo không nguyên tố cùng nhau

Giải hệ:
$$\left\{\begin{array}{rcl} 
x & \equiv & 3 \pmod{10} \\ 
x & \equiv & 5 \pmod{12} 
\end{array}\right.$$

Phân tích:
- $10 = 2 \times 5$ → $x \equiv 1 \pmod{2}$, $x \equiv 3 \pmod{5}$
- $12 = 4 \times 3$ → $x \equiv 1 \pmod{4}$, $x \equiv 2 \pmod{3}$

Vì $x \equiv 1 \pmod{4}$ ngụ ý $x \equiv 1 \pmod{2}$, ta giải:
$$\left\{\begin{array}{rcl} 
x & \equiv & 3 \pmod{5} \\ 
x & \equiv & 1 \pmod{4} \\ 
x & \equiv & 2 \pmod{3} 
\end{array}\right.$$

Kết quả: $x = 53 \pmod{60}$

## Ứng dụng

1. **Số học lớn**: Biểu diễn và tính toán với số có nhiều chữ số
2. **Mã hóa**: Sử dụng trong các hệ mã hóa như RSA
3. **Tính toán song song**: Phân chia tính toán thành các phép toán modular nhỏ
4. **Thuật toán số**: Giải các bài toán lý thuyết số phức tạp

## Độ phức tạp

- **Thời gian**: $O(k \log M)$ với $k$ là số phương trình và $M$ là tích các modulo
- **Không gian**: $O(k)$ để lưu trữ các phương trình

## Bài tập thực hành

1. [Google Code Jam - Golf Gophers](https://github.com/google/coding-competitions-archive/blob/main/codejam/2019/round_1a/golf_gophers/statement.pdf)
2. [Hackerrank - Number of sequences](https://www.hackerrank.com/contests/w22/challenges/number-of-sequences)
3. [Codeforces - Remainders Game](http://codeforces.com/problemset/problem/687/B)

## Tài liệu tham khảo

1. Thomas H. Cormen, "Introduction to Algorithms"
2. Kenneth H. Rosen, "Elementary Number Theory and Its Applications"
3. [CP-Algorithms - Chinese Remainder Theorem](https://cp-algorithms.com/algebra/chinese-remainder-theorem.html)
4. Donald E. Knuth, "The Art of Computer Programming, Volume 2"